const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const {
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
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', auth, authorizeRoles('customer'), asyncHandler(createOrder));
router.post('/:id/confirm', auth, authorizeRoles('vendor'), asyncHandler(confirmOrder));
router.post('/:id/ready', auth, authorizeRoles('vendor'), asyncHandler(markReady));
router.post('/:id/assign', auth, authorizeRoles('driver'), asyncHandler(assignOrder));
router.post('/:id/pickedup', auth, authorizeRoles('driver'), asyncHandler(markPickedUp));
router.post('/:id/deliver', auth, authorizeRoles('driver'), asyncHandler(markDelivered));
router.post('/:id/delivery-photo/approve', auth, authorizeRoles('vendor'), asyncHandler(approveDeliveryPhoto));
router.post('/:id/delivery-photo/reject', auth, authorizeRoles('vendor'), asyncHandler(rejectDeliveryPhoto));
router.post('/:id/pay-driver', auth, authorizeRoles('vendor'), asyncHandler(payDriver));
router.post('/:id/rate-driver', auth, authorizeRoles('customer'), asyncHandler(rateDriver));

module.exports = router;
