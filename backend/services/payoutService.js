const Order = require('../models/Order');
const Driver = require('../models/Driver');
const { emitToRoom } = require('../sockets');

const AUTO_PAY_WINDOW_MS = 5 * 60 * 1000;
const timers = new Map();

function scheduleAutoPay (orderId) {
  const key = orderId.toString();
  clearAutoPay(orderId);
  const timer = setTimeout(async () => {
    try {
      await payOrder(orderId, { auto: true, skipIfReviewed: true });
    } catch (error) {
      console.error('Auto-pay error:', error.message); // eslint-disable-line no-console
    }
  }, AUTO_PAY_WINDOW_MS);

  timers.set(key, timer);
}

function clearAutoPay (orderId) {
  const key = orderId.toString();
  const timer = timers.get(key);
  if (timer) {
    clearTimeout(timer);
    timers.delete(key);
  }
}

async function payOrder (orderId, { auto = false, skipIfReviewed = false } = {}) {
  const order = await Order.findById(orderId);
  if (!order) {
    clearAutoPay(orderId);
    return null;
  }

  if (skipIfReviewed && order.deliveryPhotoReviewedAt) {
    clearAutoPay(orderId);
    return order;
  }

  if (order.isPaid) {
    clearAutoPay(orderId);
    return order;
  }

  order.isPaid = true;
  order.paidAt = new Date();

  await order.save();

  if (order.assignedDriver) {
    await Driver.findByIdAndUpdate(order.assignedDriver, { $inc: { deliveriesCompleted: 1 } });
  }

  clearAutoPay(orderId);

  const payload = {
    orderId: order._id,
    driverId: order.assignedDriver,
    vendorId: order.vendorId,
    amount: order.driverPayout,
    paidAt: order.paidAt,
    auto
  };

  emitToRoom(`order:${order._id}`, 'payout:completed', payload);
  emitToRoom(`vendor:${order.vendorId}`, 'payout:completed', payload);
  if (order.assignedDriver) {
    emitToRoom(`driver:${order.assignedDriver}`, 'payout:completed', payload);
  }

  return order;
}

module.exports = {
  scheduleAutoPay,
  clearAutoPay,
  payOrder
};
