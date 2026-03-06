const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const Measurement = require('../models/Measurement');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Power BI Push Helper ─────────────────────────────────────────────────────
// Pushes a single measurement row to a Power BI Streaming Dataset.
// The push URL is set via POWERBI_PUSH_URL in .env (no OAuth needed).
// Failure is logged but does NOT fail the main response.
async function pushToPowerBI(data) {
    const pushUrl = process.env.POWERBI_PUSH_URL;
    if (!pushUrl) return; // not configured — skip silently

    const row = [{
        timestamp: new Date().toISOString(),
        pm25: data.pm25,
        pm10: data.pm10,
        aqi: data.aqi,
        status: data.status,
        confidence: data.confidence ?? null,
        simulated: data.simulated || false,
    }];

    try {
        await axios.post(pushUrl, row, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
        });
        console.log('✅ Power BI push successful — AQI:', data.aqi, '| Status:', data.status);
    } catch (err) {
        console.error('⚠️  Power BI push failed (non-fatal):', err.message);
    }
}

// POST /api/measure/analyze  — forward image to ML service, save result, push to Power BI
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image file provided' });

        // Build multipart form for the Python ML service
        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const mlRes = await axios.post(`${ML_SERVICE_URL}/analyze`, form, {
            headers: form.getHeaders(),
            timeout: 30000,
        });

        const data = mlRes.data;

        // Persist to MongoDB
        const measurement = new Measurement({
            pm25: data.pm25,
            pm10: data.pm10,
            aqi: data.aqi,
            status: data.status,
            confidence: data.confidence,
            detections: data.detections,
            imageFile: req.file.originalname,
            simulated: data.simulated || false,
            zenabId: req.body.zenabId,
        });
        await measurement.save();

        // Push to Power BI (fire-and-forget — does not block response)
        pushToPowerBI(data);

        res.json({ ...data, id: measurement._id, savedAt: measurement.createdAt });
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({ error: 'ML service is not running. Start it with: python3 MLService/app.py' });
        }
        res.status(500).json({ error: err.message });
    }
});

// GET /api/measure/history — last 50 measurements
router.get('/history', async (req, res) => {
    try {
        const { zenabId } = req.query;
        const filter = zenabId ? { zenabId } : {};
        const measurements = await Measurement.find(filter).sort({ createdAt: -1 }).limit(50);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/measure/latest — the most recent single measurement
router.get('/latest', async (req, res) => {
    try {
        const m = await Measurement.findOne().sort({ createdAt: -1 });
        if (!m) return res.status(404).json({ error: 'No measurements yet' });
        res.json(m);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
