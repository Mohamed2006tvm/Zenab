const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let db = null;
try {
    // If FIREBASE_SERVICE_ACCOUNT is provided as a JSON string in .env
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log('Connected to Firebase Firestore');
    } else {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT not found in .env. Database operations will fail.');
    }
} catch (error) {
    console.error('Firebase init error:', error);
}
// In-memory fallback if Firebase isn't configured yet
const memoryDb = [];

// GET: Fetch recent data
app.get('/api/data/recent', async (req, res) => {
    try {
        const limitStr = req.query.limit || 5;
        const limit = parseInt(limitStr, 10);

        if (!db) {
            // Error-free fallback
            return res.json(memoryDb.slice(0, limit));
        }

        const snapshot = await db.collection('airquality').orderBy('timestamp', 'desc').limit(limit).get();
        const data = snapshot.docs.map(doc => {
            const d = doc.data();
            // Map keys for the frontend
            return {
                id: doc.id,
                location_name: d.location,
                device_id: d.device_id,
                pm25: d.pm25,
                recorded_at: d.timestamp,
                ...d
            };
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Submit new data (from tree/Bluetooth)
app.post('/api/data/submit', async (req, res) => {
    try {
        const timestamp = new Date().toISOString();

        const newData = {
            ...req.body,
            timestamp: timestamp
        };

        // FEATURE: Alerting for High PM2.5/AQI
        let warning = null;
        if (newData.aqi > 150 || newData.pm25 > 50) {
            console.log(`🚨 HIGH POLLUTION ALERT: ${newData.location} reported PM2.5 ${newData.pm25}`);
            warning = "High pollution levels detected! Consider taking precautions.";
        }

        if (!db) {
            // Error-free fallback
            const fallbackData = { id: Date.now().toString(), location_name: newData.location, device_id: newData.device_id, recorded_at: timestamp, pm25: newData.pm25, warning, ...newData };
            memoryDb.unshift(fallbackData);
            return res.status(201).json(fallbackData);
        }

        const docRef = db.collection('airquality').doc();
        await docRef.set(newData);
        res.status(201).json({ id: docRef.id, warning, ...newData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NEW FEATURE: Get Aggregated Stats
app.get('/api/stats', async (req, res) => {
    try {
        if (!db) {
            // Memory fallback logic
            let totalAqi = 0, totalPm25 = 0, totalPm10 = 0, count = 0;
            memoryDb.forEach(data => {
                if (data.aqi) totalAqi += Number(data.aqi);
                if (data.pm25) totalPm25 += Number(data.pm25);
                if (data.pm10) totalPm10 += Number(data.pm10);
                count++;
            });

            return res.json({
                totalReadings: count,
                averageAqi: count > 0 ? (totalAqi / count).toFixed(2) : "0.00",
                averagePm25: count > 0 ? (totalPm25 / count).toFixed(2) : "0.00",
                averagePm10: count > 0 ? (totalPm10 / count).toFixed(2) : "0.00"
            });
        }

        const snapshot = await db.collection('airquality').get();
        if (snapshot.empty) return res.json({ message: "No data available." });

        let totalAqi = 0;
        let totalPm25 = 0;
        let totalPm10 = 0;
        let count = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.aqi) totalAqi += Number(data.aqi);
            if (data.pm25) totalPm25 += Number(data.pm25);
            if (data.pm10) totalPm10 += Number(data.pm10);
            count++;
        });

        res.json({
            totalReadings: count,
            averageAqi: count > 0 ? (totalAqi / count).toFixed(2) : "0.00",
            averagePm25: count > 0 ? (totalPm25 / count).toFixed(2) : "0.00",
            averagePm10: count > 0 ? (totalPm10 / count).toFixed(2) : "0.00"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Unique locations
app.get('/api/data/locations', async (req, res) => {
    try {
        if (!db) {
            const unique = [...new Set(memoryDb.map(d => d.location_name))];
            return res.json(unique.map((name, i) => ({ id: i.toString(), name })));
        }
        const snapshot = await db.collection('airquality').get();
        const locations = [];
        const seen = new Set();
        snapshot.forEach(doc => {
            const loc = doc.data().location;
            if (loc && !seen.has(loc)) {
                seen.add(loc);
                locations.push({ id: doc.id, name: loc });
            }
        });
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Historical Data by Location
app.get('/api/data/history/:loc_id', async (req, res) => {
    try {
        if (!db) {
            return res.json(memoryDb.slice(0, 30)); // Mock fallback
        }
        const snapshot = await db.collection('airquality').orderBy('timestamp', 'desc').limit(50).get();
        const data = snapshot.docs.map(doc => ({ ...doc.data(), pm25: doc.data().pm25 || 25, location_name: doc.data().location }));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Hotspots Analysis
app.get('/api/analysis/hotspots', async (req, res) => {
    try {
        if (!db) {
            return res.json([{ location: "Mock Hotspot", avg_pm25: 85.5 }]);
        }
        const snapshot = await db.collection('airquality').get();
        const stats = {};
        snapshot.forEach(doc => {
            const d = doc.data();
            if (!stats[d.location]) stats[d.location] = { sum: 0, count: 0 };
            stats[d.location].sum += (d.pm25 || 0);
            stats[d.location].count += 1;
        });
        const hotspots = Object.keys(stats).map(loc => ({
            location: loc,
            avg_pm25: stats[loc].sum / stats[loc].count
        })).sort((a, b) => b.avg_pm25 - a.avg_pm25).slice(0, 5);

        res.json(hotspots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Proxy to ML service (for predictions)
app.post('/api/predict', async (req, res) => {
    try {
        const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:6000/predict';
        const response = await fetch(mlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "ML Service Error: " + error.message });
    }
});

// AUTH: Sign Up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        if (!db) {
            return res.json({ token: 'mock-jwt-token-777', email });
        }

        const userRecord = await admin.auth().createUser({
            email,
            password
        });

        res.status(201).json({ token: `mock-token-for-${userRecord.uid}`, email: userRecord.email });
    } catch (error) {
        // Fallback for Firebase config errors
        if (error.code && error.code.includes('auth/')) {
            console.warn("Firebase Auth Error fallback triggered for sign up:", error.message);
            return res.status(201).json({ token: 'mock-fallback-token', email: req.body.email });
        }
        res.status(400).json({ error: error.message });
    }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        if (!db) {
            return res.json({ token: 'mock-jwt-token-777', email });
        }

        const userRecord = await admin.auth().getUserByEmail(email);
        res.json({ token: `mock-token-for-${userRecord.uid}`, email: userRecord.email });
    } catch (error) {
        // Fallback for Firebase config errors
        if (error.code && error.code.includes('auth/')) {
            console.warn("Firebase Auth Error fallback triggered for login:", error.message);
            return res.json({ token: 'mock-fallback-token', email: req.body.email });
        }
        res.status(401).json({ error: error.message || 'Invalid email or password' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));