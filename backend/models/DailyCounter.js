const mongoose = require('mongoose');

const { Schema } = mongoose;

const dailyCounterSchema = new Schema({
  date: { type: String, required: true, unique: true },
  anonymousOrderCount: { type: Number, default: 0 }
});

module.exports = mongoose.models.DailyCounter || mongoose.model('DailyCounter', dailyCounterSchema);
