const mongoose = require('mongoose');

const { Schema } = mongoose;

const driverApplicationSchema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
  idImageUrl: { type: String },
  selfieUrl: { type: String },
  phone: { type: String },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String }
}, { _id: true });

const vendorSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  pendingDriverApplications: [driverApplicationSchema],
  approvedDrivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
