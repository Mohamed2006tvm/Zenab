const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const supabase = require('../lib/supabase');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Power BI Push Helper ─────────────────────────────────────────────────────
async function pushToPowerBI(data) {
    const pushUrl = process.env.POWERBI_PUSH_URL;
    if (!pushUrl) return; 

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

// POST /api/measure/analyze 
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image file provided' });

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

        // Persist to Supabase
        const { data: measurement, error } = await supabase
            .from('measurements')
            .insert([{
                pm25: data.pm25,
                pm10: data.pm10,
                aqi: data.aqi,
                status: data.status,
                confidence: data.confidence,
                detections: data.detections,
                image_file: req.file.originalname,
                simulated: data.simulated || false,
                zenab_id: req.body.zenabId,
            }])
            .select()
            .single();

        if (error) throw error;

        // Push to Power BI
        pushToPowerBI(data);

        res.json({ ...data, id: measurement.id, savedAt: measurement.created_at });
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({ error: 'ML service is not running.' });
        }
        res.status(500).json({ error: err.message });
    }
});

// GET /api/measure/history
router.get('/history', async (req, res) => {
    try {
        const { zenabId } = req.query;
        let query = supabase.from('measurements').select('*').order('created_at', { ascending: false }).limit(50);
        
        if (zenabId) {
            query = query.eq('zenab_id', zenabId);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/measure/latest
router.get('/latest', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('measurements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
        if (!data) return res.status(404).json({ error: 'No measurements yet' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
