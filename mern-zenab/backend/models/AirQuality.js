const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  aqi: { type: Number },
  pm25: { type: Number, required: true },  // Focus on PM2.5 as per ZENAB
  pm10: { type: Number },
  recorded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AirQuality', airQualitySchema);