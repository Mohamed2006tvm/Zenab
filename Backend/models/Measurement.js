const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    aqi: { type: Number, required: true },
    status: { type: String, required: true },
    confidence: { type: Number },
    detections: { type: Number },
    imageFile: { type: String },
    simulated: { type: Boolean, default: false },
    zenabId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Measurement', measurementSchema);
