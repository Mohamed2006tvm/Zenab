const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
    userId: { type: String },
    age: { type: Number, required: true },
    conditions: [{ type: String }],
    activityLevel: { type: String, required: true },
    currentAqi: { type: Number },
    riskLevel: { type: String },
    recommendation: { type: String },
    tips: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);
