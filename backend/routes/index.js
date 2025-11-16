const express = require('express');
const orderRoutes = require('./orders');
const driverRoutes = require('./drivers');
const vendorRoutes = require('./vendors');
const customerRoutes = require('./customers');
const uploadRoutes = require('./uploads');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/orders', orderRoutes);
router.use('/drivers', driverRoutes);
router.use('/vendors', vendorRoutes);
router.use('/customers', customerRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
