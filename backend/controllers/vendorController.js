const Vendor = require('../models/Vendor');
const Driver = require('../models/Driver');

async function loadVendor (vendorId) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    const error = new Error('Vendor not found');
    error.status = 404;
    throw error;
  }
  return vendor;
}

function ensureVendorAccess (req, vendorId) {
  if (req.user.role !== 'vendor' || req.user.id !== vendorId) {
    const error = new Error('Vendor access required for this resource');
    error.status = 403;
    throw error;
  }
}

async function inviteDriver (req, res) {
  const { vid, appId } = req.params;

  ensureVendorAccess(req, vid);
  const vendor = await loadVendor(vid);
  const application = vendor.pendingDriverApplications.id(appId);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const driver = await Driver.findById(application.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.profile.verifiedStatus = 'invited';
  await driver.save();

  await vendor.save();

  res.json({ message: 'Driver invited', application });
}

async function approveDriver (req, res) {
  const { vid, appId } = req.params;

  ensureVendorAccess(req, vid);
  const vendor = await loadVendor(vid);
  const application = vendor.pendingDriverApplications.id(appId);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const driver = await Driver.findById(application.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.profile.verifiedStatus = 'approved';
  if (!driver.profile.approvedVendors.some((vendorRef) => vendorRef.toString() === vid)) {
    driver.profile.approvedVendors.push(vendor._id);
  }
  await driver.save();

  if (!vendor.approvedDrivers.some((driverId) => driverId.toString() === driver.id)) {
    vendor.approvedDrivers.push(driver._id);
  }

  application.deleteOne();
  await vendor.save();

  res.json({ message: 'Driver approved', vendor, driver });
}

async function rejectDriver (req, res) {
  const { vid, appId } = req.params;

  ensureVendorAccess(req, vid);
  const vendor = await loadVendor(vid);
  const application = vendor.pendingDriverApplications.id(appId);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const driver = await Driver.findById(application.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.profile.verifiedStatus = 'rejected';
  await driver.save();

  application.deleteOne();
  await vendor.save();

  res.json({ message: 'Driver rejected' });
}

async function getApprovedDrivers (req, res) {
  const { id } = req.params;
  const { limit = 20, page = 1, sort = 'rating' } = req.query;

  const vendor = await loadVendor(id);
  const driverIds = vendor.approvedDrivers;

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
    Driver.find({ _id: { $in: driverIds } })
      .sort(sortOption)
      .skip(skip)
      .limit(numericLimit),
    Driver.countDocuments({ _id: { $in: driverIds } })
  ]);

  res.json({
    drivers,
    page: numericPage,
    totalPages: Math.ceil(total / numericLimit) || 1,
    total
  });
}

module.exports = {
  inviteDriver,
  approveDriver,
  rejectDriver,
  getApprovedDrivers
};
