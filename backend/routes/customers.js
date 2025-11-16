const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const {
  getCustomerProfile,
  addFavoriteDriver,
  removeFavoriteDriver
} = require('../controllers/customerController');

const router = express.Router();

router.get('/:id', auth, authorizeRoles('customer'), asyncHandler(getCustomerProfile));
router.post('/:id/favorites', auth, authorizeRoles('customer'), asyncHandler(addFavoriteDriver));
router.delete('/:id/favorites/:driverId', auth, authorizeRoles('customer'), asyncHandler(removeFavoriteDriver));

module.exports = router;
