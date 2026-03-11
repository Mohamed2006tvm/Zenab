const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET daily report - all cities with AQI data
router.get('/daily', async (req, res) => {
    try {
        const { data: stations, error } = await supabase
            .from('stations')
            .select('*')
            .order('aqi', { ascending: false });

        if (error) throw error;

        const report = stations.map((s) => ({
            city: s.city,
            state: s.state,
            aqi: s.aqi,
            pm25: s.pm25,
            pm10: s.pm10,
            no2: s.no2,
            o3: s.o3,
            status: s.status,
            date: new Date().toISOString().split('T')[0],
        }));
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET top 10 most polluted cities
router.get('/top-polluted', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stations')
            .select('*')
            .order('aqi', { ascending: false })
            .limit(10);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET cleanest cities
router.get('/cleanest', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stations')
            .select('*')
            .order('aqi', { ascending: true })
            .limit(10);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
