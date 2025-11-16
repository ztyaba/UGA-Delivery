const mongoose = require('mongoose');

let isConnected = false;

async function connectDB () {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uganda_food_delivery';

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('MongoDB connected'); // eslint-disable-line no-console
  } catch (error) {
    console.error('MongoDB connection error:', error.message); // eslint-disable-line no-console
    process.exit(1);
  }
}

module.exports = connectDB;
