const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const { addFavoriteDriver, removeFavoriteDriver } = require('../controllers/customerController');

const router = express.Router();

router.post('/:id/favorites', auth, authorizeRoles('customer'), asyncHandler(addFavoriteDriver));
router.delete('/:id/favorites/:driverId', auth, authorizeRoles('customer'), asyncHandler(removeFavoriteDriver));

module.exports = router;
