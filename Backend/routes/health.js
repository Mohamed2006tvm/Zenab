const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

function generateRecommendation(age, conditions, activityLevel, currentAqi) {
    const aqiLevel = currentAqi || 100;
    let riskLevel = 'Low';
    let tips = [];
    let recommendation = '';

    const hasConditions = conditions && conditions.length > 0;
    const isSensitive = hasConditions || age > 65 || age < 12;

    if (aqiLevel <= 50) {
        riskLevel = 'Low';
        recommendation = 'Air quality is excellent! Enjoy outdoor activities freely.';
        tips = [
            'Great day for outdoor exercise',
            'Open windows for ventilation',
            'No special precautions needed',
        ];
    } else if (aqiLevel <= 100) {
        riskLevel = isSensitive ? 'Moderate' : 'Low';
        recommendation = isSensitive
            ? 'Air quality is acceptable but sensitive individuals should take care.'
            : 'Air quality is acceptable. Most people can enjoy outdoor activities.';
        tips = [
            isSensitive ? 'Limit prolonged outdoor exertion' : 'Outdoor activities are fine',
            'Monitor symptoms if you have respiratory conditions',
            'Keep medications accessible',
        ];
    } else if (aqiLevel <= 150) {
        riskLevel = isSensitive ? 'High' : 'Moderate';
        recommendation = 'Unhealthy for sensitive groups. Reduce outdoor activity.';
        tips = [
            'Reduce prolonged outdoor exertion',
            'Wear N95 mask if going outside',
            'Keep windows closed',
            'Use air purifier indoors',
        ];
    } else if (aqiLevel <= 200) {
        riskLevel = 'High';
        recommendation = 'Unhealthy air quality. Everyone should limit outdoor activity.';
        tips = [
            'Avoid outdoor exercise',
            'Wear N95/KN95 mask if you must go outside',
            'Keep indoors with windows shut',
            'Run air purifier on high setting',
            'Seek medical attention if symptoms worsen',
        ];
    } else {
        riskLevel = 'Very High';
        recommendation = 'Hazardous air quality! Stay indoors and avoid all outdoor activities.';
        tips = [
            'Stay indoors at all times',
            'Seal gaps around windows and doors',
            'Wear respirator mask if evacuation is needed',
            'Contact healthcare provider if breathing difficulties occur',
            'Follow local emergency guidelines',
        ];
    }

    // Activity level adjustments
    if (activityLevel === 'intense' || activityLevel === 'professional') {
        tips.push('Consider rescheduling intense training for better air quality days');
    }

    return { riskLevel, recommendation, tips };
}

// POST - assess health
router.post('/assess', async (req, res) => {
    try {
        const { userId, age, conditions, activityLevel, currentAqi } = req.body;
        if (!age || !activityLevel) {
            return res.status(400).json({ error: 'age and activityLevel are required' });
        }

        const { riskLevel, recommendation, tips } = generateRecommendation(
            age,
            conditions,
            activityLevel,
            currentAqi
        );

        const { data, error } = await supabase
            .from('health_assessments')
            .insert([{
                user_id: userId || null,
                age,
                conditions: conditions || [],
                activity_level: activityLevel,
                current_aqi: currentAqi,
                risk_level: riskLevel,
                recommendation,
                tips: tips || []
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ riskLevel, recommendation, tips, id: data.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET recent assessments for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('health_assessments')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
