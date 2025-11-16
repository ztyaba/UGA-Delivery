const Customer = require('../models/Customer');
const Driver = require('../models/Driver');

function ensureCustomerAccess (req, customerId) {
  if (req.user.role !== 'customer' || req.user.id !== customerId) {
    const error = new Error('Customer access required');
    error.status = 403;
    throw error;
  }
}

async function getCustomerProfile (req, res) {
  const { id } = req.params;

  ensureCustomerAccess(req, id);

  const customer = await Customer.findById(id).populate('favoriteDrivers');
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.json({ customer });
}

async function addFavoriteDriver (req, res) {
  const { id } = req.params;
  const { driverId } = req.body;

  ensureCustomerAccess(req, id);

  if (!driverId) {
    return res.status(400).json({ message: 'driverId is required' });
  }

  const [customer, driver] = await Promise.all([
    Customer.findById(id),
    Driver.findById(driverId)
  ]);

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  if (!customer.favoriteDrivers.some((fav) => fav.toString() === driverId)) {
    customer.favoriteDrivers.push(driverId);
    await customer.save();
  }

  res.json({ customer });
}

async function removeFavoriteDriver (req, res) {
  const { id, driverId } = req.params;

  ensureCustomerAccess(req, id);

  const customer = await Customer.findById(id);
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customer.favoriteDrivers = customer.favoriteDrivers.filter((fav) => fav.toString() !== driverId);
  await customer.save();

  res.json({ customer });
}

module.exports = {
  getCustomerProfile,
  addFavoriteDriver,
  removeFavoriteDriver
};
