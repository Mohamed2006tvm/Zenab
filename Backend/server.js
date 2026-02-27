const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zenab';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected to:', MONGO_URI);
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
