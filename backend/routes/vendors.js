const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const {
  inviteDriver,
  approveDriver,
  rejectDriver,
  getApprovedDrivers
} = require('../controllers/vendorController');

const router = express.Router();

router.get('/:id/approved-drivers', asyncHandler(getApprovedDrivers));
router.post('/:vid/applications/:appId/invite', auth, authorizeRoles('vendor'), asyncHandler(inviteDriver));
router.post('/:vid/applications/:appId/approve', auth, authorizeRoles('vendor'), asyncHandler(approveDriver));
router.post('/:vid/applications/:appId/reject', auth, authorizeRoles('vendor'), asyncHandler(rejectDriver));

module.exports = router;
