const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', require('./routes/stations'));
app.use('/api/aqi', require('./routes/aqi'));
app.use('/api/health', require('./routes/health'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/measure', require('./routes/measure'));

app.get('/', (req, res) => {
    res.json({ message: 'Zenab API is running', version: '1.0.0' });
});

// ─── Power BI Status & Test ────────────────────────────────────────────────────
// GET /api/powerbi/status — tells the frontend whether Power BI is configured
app.get('/api/powerbi/status', (req, res) => {
    const pushUrl = process.env.POWERBI_PUSH_URL;
    res.json({
        configured: !!(pushUrl && pushUrl.trim().length > 0),
        hint: 'Set POWERBI_PUSH_URL in Backend/.env to enable live streaming.',
    });
});

// POST /api/powerbi/push — manual test push with sample data
app.post('/api/powerbi/push', async (req, res) => {
    const pushUrl = process.env.POWERBI_PUSH_URL;
    if (!pushUrl || !pushUrl.trim()) {
        return res.status(400).json({ error: 'POWERBI_PUSH_URL is not configured in .env' });
    }

    const row = req.body.row || [{
        timestamp: new Date().toISOString(),
        pm25: 45.2,
        pm10: 78.5,
        aqi: 127,
        status: 'Unhealthy for Sensitive Groups',
        confidence: 0.87,
        simulated: true,
    }];

    try {
        await axios.post(pushUrl, Array.isArray(row) ? row : [row], {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
        });
        console.log('✅ Manual Power BI test push successful');
        res.json({ success: true, pushed: row });
    } catch (err) {
        console.error('❌ Power BI test push failed:', err.message);
        res.status(502).json({ error: 'Power BI push failed: ' + err.message });
    }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zenab';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected to:', MONGO_URI);
        console.log('🔌 Power BI push:', process.env.POWERBI_PUSH_URL ? '✅ Configured' : '⚠️  Not configured (set POWERBI_PUSH_URL in .env)');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

