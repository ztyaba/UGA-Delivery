const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String },
  phone: { type: String },
  email: { type: String },
  favoriteDrivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
