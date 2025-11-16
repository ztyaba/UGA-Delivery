const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Vendor = require('../models/Vendor');
const { emitToRoom } = require('../sockets');

function assertDriverAccess (req, driverIdParam) {
  if (req.user.role !== 'driver') {
    const error = new Error('Driver role required');
    error.status = 403;
    throw error;
  }

  if (req.user.id !== driverIdParam) {
    const error = new Error('Drivers may only manage their own profile');
    error.status = 403;
    throw error;
  }
}

async function getDriverProfile (req, res) {
  const { id } = req.params;

  assertDriverAccess(req, id);

  const driver = await Driver.findById(id);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  res.json({ driver });
}

async function getDriversByIds (req, res) {
  const idsParam = req.query.ids;
  if (!idsParam) {
    return res.json({ drivers: [] });
  }

  const ids = idsParam
    .split(',')
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (ids.length === 0) {
    return res.json({ drivers: [] });
  }

  const drivers = await Driver.find({ _id: { $in: ids } });
  res.json({ drivers });
}

async function applyToVendor (req, res) {
  const { id } = req.params;
  const { vendorId, idImageUrl, selfieUrl, phone } = req.body;

  assertDriverAccess(req, id);

  if (!vendorId || !idImageUrl || !selfieUrl || !phone) {
    return res.status(400).json({ message: 'vendorId, idImageUrl, selfieUrl, and phone are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: 'Invalid vendorId' });
  }

  const driver = await Driver.findById(id);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.profile.idImageUrl = idImageUrl;
  driver.profile.selfieUrl = selfieUrl;
  driver.profile.phone = phone;
  driver.profile.verifiedStatus = 'applied';
  await driver.save();

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }

  const existingApplication = vendor.pendingDriverApplications.find(
    (app) => app.driverId.toString() === id
  );

  if (existingApplication) {
    existingApplication.idImageUrl = idImageUrl;
    existingApplication.selfieUrl = selfieUrl;
    existingApplication.phone = phone;
    existingApplication.appliedAt = new Date();
  } else {
    vendor.pendingDriverApplications.push({
      driverId: mongoose.Types.ObjectId(id),
      idImageUrl,
      selfieUrl,
      phone
    });
  }

  await vendor.save();

  const application = vendor.pendingDriverApplications.find((app) => app.driverId.toString() === id);

  emitToRoom(`vendor:${vendorId}`, 'vendor:driver-application', {
    vendorId,
    driverId: driver._id,
    applicationId: application ? application._id : null
  });

  emitToRoom(`driver:${driver._id}`, 'driver:application-updated', {
    vendorId,
    status: driver.profile.verifiedStatus
  });

  res.json({ message: 'Application submitted', driver, vendorId });
}

async function selectVendors (req, res) {
  const { id } = req.params;
  const { vendorIds = [] } = req.body;

  assertDriverAccess(req, id);

  if (!Array.isArray(vendorIds)) {
    return res.status(400).json({ message: 'vendorIds must be an array' });
  }

  const driver = await Driver.findById(id);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  const approvedSet = new Set(driver.profile.approvedVendors.map((v) => v.toString()));
  const filtered = vendorIds
    .filter((vid) => mongoose.Types.ObjectId.isValid(vid) && approvedSet.has(vid))
    .map((vid) => mongoose.Types.ObjectId(vid));

  driver.profile.deliverForVendors = filtered;
  await driver.save();

  res.json({ driver });
}

async function searchDrivers (req, res) {
  const { search = '', limit = 20, page = 1, sort = 'rating' } = req.query;

  const query = {};
  if (search) {
    query['profile.fullName'] = { $regex: search, $options: 'i' };
  }

  const numericLimit = Math.min(Number(limit) || 20, 100);
  const numericPage = Math.max(Number(page) || 1, 1);
  const skip = (numericPage - 1) * numericLimit;

  const sortOption = {};
  if (sort === 'rating') {
    sortOption.rating = -1;
    sortOption.ratingCount = -1;
  } else if (sort === 'name') {
    sortOption['profile.fullName'] = 1;
  }

  const [drivers, total] = await Promise.all([
    Driver.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(numericLimit),
    Driver.countDocuments(query)
  ]);

  res.json({
    drivers,
    page: numericPage,
    totalPages: Math.ceil(total / numericLimit) || 1,
    total
  });
}

module.exports = {
  getDriverProfile,
  getDriversByIds,
  applyToVendor,
  selectVendors,
  searchDrivers
};
