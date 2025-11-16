const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },

  customerShowsName: { type: Boolean, default: true },
  anonymousOrderNumber: { type: Number, default: null },

  driverPayout: { type: Number, default: 0 },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
  customerSelectedDriver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },

  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready for Pickup', 'On the Way', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },

  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  pickedUpAt: { type: Date },
  deliveredAt: { type: Date },

  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  deliveryPhotoUrl: { type: String },
  deliveryPhotoApproved: { type: Boolean, default: false },
  deliveryPhotoReviewedAt: { type: Date },
  deliveryPhotoReviewerId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  deliveryPhotoRejectNote: { type: String },

  driverRatedByCustomer: { type: Boolean, default: false }
});

orderSchema.index({ vendorId: 1 });
orderSchema.index({ assignedDriver: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
