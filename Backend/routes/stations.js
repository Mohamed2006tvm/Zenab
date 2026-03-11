const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET all stations
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stations')
            .select('*')
            .order('aqi', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET station by ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stations')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Station not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET stations by city
router.get('/city/:city', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stations')
            .select('*')
            .ilike('city', `%${req.params.city}%`);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
