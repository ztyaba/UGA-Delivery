const mongoose = require('mongoose');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Driver = require('../models/Driver');
const DailyCounter = require('../models/DailyCounter');
const { scheduleAutoPay, clearAutoPay, payOrder } = require('../services/payoutService');

function assertObjectId (value, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`${fieldName} is invalid`);
    error.status = 400;
    throw error;
  }
}

async function generateAnonymousNumber () {
  const today = new Date().toISOString().split('T')[0];
  const counter = await DailyCounter.findOneAndUpdate(
    { date: today },
    { $inc: { anonymousOrderCount: 1 } },
    { new: true, upsert: true }
  );
  return counter.anonymousOrderCount;
}

async function createOrder (req, res) {
  const {
    vendorId,
    items = [],
    deliveryAddress,
    contactPhone,
    customerShowsName = true,
    customerSelectedDriver = null,
    driverPayout = 0
  } = req.body;

  if (!vendorId || !deliveryAddress || !contactPhone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'vendorId, items, deliveryAddress, and contactPhone are required' });
  }

  const hasInvalidItems = items.some((item) => !item || typeof item.name !== 'string' || item.name.trim() === '');
  if (hasInvalidItems) {
    return res.status(400).json({ message: 'Each item must include a name' });
  }

  assertObjectId(vendorId, 'vendorId');

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (customerSelectedDriver) {
    assertObjectId(customerSelectedDriver, 'customerSelectedDriver');
    const isApproved = vendor.approvedDrivers.some((driverId) => driverId.toString() === customerSelectedDriver);
    if (!isApproved) {
      return res.status(400).json({ message: 'Selected driver is not approved for this vendor' });
    }
  }

  let anonymousOrderNumber = null;
  if (!customerShowsName) {
    anonymousOrderNumber = await generateAnonymousNumber();
  }

  const payoutValue = Number(driverPayout) >= 0 ? Number(driverPayout) : 0;

  const normalizedItems = items.map((item) => ({
    name: item.name.trim(),
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    price: Number(item.price) >= 0 ? Number(item.price) : 0
  }));

  const order = await Order.create({
    customerId: req.user.id,
    vendorId,
    items: normalizedItems,
    deliveryAddress,
    contactPhone,
    customerShowsName,
    anonymousOrderNumber,
    customerSelectedDriver,
    driverPayout: payoutValue
  });

  res.status(201).json({ order });
}

async function getOrderForVendor (orderId, vendorId) {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  if (order.vendorId.toString() !== vendorId) {
    const error = new Error('Order does not belong to this vendor');
    error.status = 403;
    throw error;
  }

  return order;
}

async function confirmOrder (req, res) {
  const { id } = req.params;
  const { driverPayout } = req.body;

  const order = await getOrderForVendor(id, req.user.id);

  if (order.status !== 'Pending') {
    return res.status(400).json({ message: 'Only pending orders can be confirmed' });
  }

  if (typeof driverPayout === 'number' && !Number.isNaN(driverPayout)) {
    order.driverPayout = Math.max(0, driverPayout);
  }

  order.status = 'Preparing';
  order.confirmedAt = new Date();
  await order.save();

  res.json({ order });
}

async function markReady (req, res) {
  const { id } = req.params;
  const order = await getOrderForVendor(id, req.user.id);

  if (order.status !== 'Preparing') {
    return res.status(400).json({ message: 'Only preparing orders can be marked ready' });
  }

  order.status = 'Ready for Pickup';
  await order.save();
  res.json({ order });
}

async function assignOrder (req, res) {
  const { id } = req.params;
  const { driverId = req.user.id } = req.body;

  assertObjectId(driverId, 'driverId');

  if (req.user.role === 'driver' && req.user.id !== driverId) {
    return res.status(403).json({ message: 'Drivers may only assign themselves' });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  const vendor = await Vendor.findById(order.vendorId);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  if (order.customerSelectedDriver && order.customerSelectedDriver.toString() !== driverId) {
    return res.status(403).json({ message: 'This order is reserved for the selected driver' });
  }

  const isApproved = vendor.approvedDrivers.some((approvedId) => approvedId.toString() === driverId);
  if (!isApproved) {
    return res.status(403).json({ message: 'Driver is not approved for this vendor' });
  }

  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: id,
      assignedDriver: null,
      status: 'Ready for Pickup'
    },
    {
      $set: {
        assignedDriver: driverId,
        status: 'On the Way'
      }
    },
    { new: true }
  );

  if (!updatedOrder) {
    return res.status(409).json({ message: 'Order already assigned or not ready' });
  }

  res.json({ order: updatedOrder });
}

async function markPickedUp (req, res) {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!order.assignedDriver || order.assignedDriver.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Only the assigned driver can update pickup status' });
  }

  if (!['Ready for Pickup', 'On the Way'].includes(order.status)) {
    return res.status(400).json({ message: 'Order is not ready for pickup' });
  }

  order.pickedUpAt = new Date();
  order.status = 'On the Way';
  await order.save();

  res.json({ order });
}

async function markDelivered (req, res) {
  const { id } = req.params;
  const { deliveryPhotoUrl } = req.body;

  if (!deliveryPhotoUrl) {
    return res.status(400).json({ message: 'deliveryPhotoUrl is required' });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!order.assignedDriver || order.assignedDriver.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Only the assigned driver can mark delivery' });
  }

  if (!['On the Way', 'Delivered'].includes(order.status)) {
    return res.status(400).json({ message: 'Order is not ready to be delivered' });
  }

  order.deliveryPhotoUrl = deliveryPhotoUrl;
  order.deliveryPhotoApproved = false;
  order.deliveryPhotoReviewedAt = undefined;
  order.deliveryPhotoReviewerId = undefined;
  order.deliveryPhotoRejectNote = undefined;
  order.deliveredAt = new Date();
  order.status = 'Delivered';

  await order.save();

  scheduleAutoPay(order._id);

  res.json({ order });
}

async function approveDeliveryPhoto (req, res) {
  const { id } = req.params;
  const order = await getOrderForVendor(id, req.user.id);

  if (order.status !== 'Delivered') {
    return res.status(400).json({ message: 'Only delivered orders can be reviewed' });
  }

  order.deliveryPhotoApproved = true;
  order.deliveryPhotoReviewedAt = new Date();
  order.deliveryPhotoReviewerId = req.user.id;
  order.deliveryPhotoRejectNote = undefined;
  await order.save();

  await payOrder(order._id, { auto: false });

  const updatedOrder = await Order.findById(order._id);
  res.json({ order: updatedOrder });
}

async function rejectDeliveryPhoto (req, res) {
  const { id } = req.params;
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ message: 'Rejection note is required' });
  }

  const order = await getOrderForVendor(id, req.user.id);

  if (order.status !== 'Delivered') {
    return res.status(400).json({ message: 'Only delivered orders can be reviewed' });
  }

  order.deliveryPhotoApproved = false;
  order.deliveryPhotoReviewedAt = new Date();
  order.deliveryPhotoReviewerId = req.user.id;
  order.deliveryPhotoRejectNote = note;
  await order.save();

  clearAutoPay(order._id);

  res.json({ order });
}

async function payDriver (req, res) {
  const { id } = req.params;
  const order = await getOrderForVendor(id, req.user.id);

  if (order.status !== 'Delivered') {
    return res.status(400).json({ message: 'Order must be delivered before paying driver' });
  }

  await payOrder(order._id, { auto: false });

  const updated = await Order.findById(order._id);

  res.json({ order: updated });
}

async function rateDriver (req, res) {
  const { id } = req.params;
  let { rating } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.customerId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Only the order owner can rate the driver' });
  }

  if (order.status !== 'Delivered') {
    return res.status(400).json({ message: 'Order must be delivered before rating' });
  }

  if (order.driverRatedByCustomer) {
    return res.status(400).json({ message: 'Order already rated' });
  }

  if (!order.assignedDriver) {
    return res.status(400).json({ message: 'No driver assigned to this order' });
  }

  rating = Number(rating);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const driver = await Driver.findById(order.assignedDriver);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  const newRating = ((driver.rating * driver.ratingCount) + rating) / (driver.ratingCount + 1);
  driver.rating = Number(newRating.toFixed(2));
  driver.ratingCount += 1;
  await driver.save();

  order.driverRatedByCustomer = true;
  await order.save();

  res.json({ order, driver });
}

module.exports = {
  createOrder,
  confirmOrder,
  markReady,
  assignOrder,
  markPickedUp,
  markDelivered,
  approveDeliveryPhoto,
  rejectDeliveryPhoto,
  payDriver,
  rateDriver
};
