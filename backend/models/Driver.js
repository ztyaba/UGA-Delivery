const mongoose = require('mongoose');

const { Schema } = mongoose;

const driverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  profile: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    idImageUrl: { type: String },
    selfieUrl: { type: String },
    verifiedStatus: {
      type: String,
      enum: ['none', 'applied', 'invited', 'approved', 'rejected'],
      default: 'none'
    },
    approvedVendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }],
    deliverForVendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }]
  },
  deliveriesCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
