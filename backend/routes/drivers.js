const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const { applyToVendor, selectVendors, searchDrivers } = require('../controllers/driverController');

const router = express.Router();

router.get('/', asyncHandler(searchDrivers));
router.post('/:id/apply-to-vendor', auth, authorizeRoles('driver'), asyncHandler(applyToVendor));
router.post('/:id/select-vendors', auth, authorizeRoles('driver'), asyncHandler(selectVendors));

module.exports = router;
