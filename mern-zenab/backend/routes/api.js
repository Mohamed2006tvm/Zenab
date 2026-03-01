const express = require('express');
const router = express.Router();
const axios = require('axios');
const AirQuality = require('../models/AirQuality');
const { protect } = require('../middleware/auth');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:6000';

// POST /api/data/submit -> receive PM2.5 + device/location info
router.post('/data/submit', async (req, res) => {
    try {
        const { device_id, location, latitude, longitude, pm25 } = req.body;

        if (pm25 === undefined) {
            return res.status(400).json({ error: 'PM2.5 value is required' });
        }

        const newReading = await AirQuality.create({
            device_id,
            location_name: location,
            latitude,
            longitude,
            pm25
        });

        res.status(201).json({ message: 'Data submitted successfully', data: newReading });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ error: 'Failed to submit data' });
    }
});

// GET /api/data/recent -> last 100 readings
router.get('/data/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const data = await AirQuality.find().sort({ timestamp: -1 }).limit(limit);
        // map timestamp to recorded_at for frontend compatibility
        const formattedData = data.map(d => ({
            ...d._doc,
            recorded_at: d.timestamp
        }));
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching recent data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// GET /api/analysis/hotspots -> aggregate last 6 months
router.get('/analysis/hotspots', async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const hotspots = await AirQuality.aggregate([
            { $match: { timestamp: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: '$location_name',
                    avg_pm25: { $avg: '$pm25' },
                    max_pm25: { $max: '$pm25' }
                }
            },
            { $sort: { avg_pm25: -1 } },
            { $limit: 5 },
            { $project: { location: '$_id', avg_pm25: 1, max_pm25: 1, _id: 0 } }
        ]);

        if (hotspots.length === 0) {
            // Fallback mock data if empty
            return res.json([
                { location: 'New Delhi (Mock)', avg_pm25: 125.4, max_pm25: 250.0 },
                { location: 'Mumbai (Mock)', avg_pm25: 85.2, max_pm25: 190.0 },
                { location: 'Bangalore (Mock)', avg_pm25: 45.1, max_pm25: 120.0 },
            ]);
        }

        res.json(hotspots);
    } catch (error) {
        console.error('Error fetching hotspots:', error);
        res.status(500).json({ error: 'Failed to fetch hotspots' });
    }
});

// POST /api/predict -> proxy to Python ML service
router.post('/predict', async (req, res) => {
    try {
        const { location, historical_pm25 } = req.body;

        // Call Python ML service
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            location,
            historical_pm25
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with ML service:', error.message);
        res.json({
            location: req.body.location,
            predicted_next_30_days: Array(30).fill(50).map(() => 40 + Math.random() * 20),
            trend: "stable",
            hotspot_level: "medium",
            message: "Fallback data (ML service unreachable)"
        });
    }
});

// GET /api/recommendations -> rule-based suggestions
router.get('/recommendations', async (req, res) => {
    const pm25 = parseFloat(req.query.pm25) || 50;

    let recommendations = [];
    if (pm25 > 150) {
        recommendations = [
            "Immediate traffic restriction in hotspot zone",
            "Halt nearby construction activities",
            "Deploy mobile air purifiers or more ZENAB trees",
            "Issue public health warning (N95 masks recommended)"
        ];
    } else if (pm25 > 60) {
        recommendations = [
            "Increase urban greenery planting density",
            "Promote use of public transport",
            "Optimize traffic light timings to reduce idling emissions",
            "Water sprinkling on major roads"
        ];
    } else {
        recommendations = [
            "Air quality is satisfactory",
            "Continue regular maintenance of existing green infrastructure",
            "Promote general environmental awareness"
        ];
    }

    res.json({ pm25_level: pm25, recommendations });
});

module.exports = router;
