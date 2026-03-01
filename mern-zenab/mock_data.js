require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MongoDB URI not found in backend/.env');
    process.exit(1);
}

const airQualitySchema = new mongoose.Schema({
    device_id: String,
    location_name: String,
    latitude: Number,
    longitude: Number,
    pm25: Number,
    timestamp: Date,
});

// Avoid "OverwritemodelError" by checking models
const AirQuality = mongoose.models.AirQuality || mongoose.model('AirQuality', airQualitySchema);

const LOCATIONS = [
    { id: 'tree-001', name: 'Connaught Place, Delhi', lat: 28.6304, lng: 77.2177, basePm: 120 },
    { id: 'tree-002', name: 'India Gate, Delhi', lat: 28.6129, lng: 77.2295, basePm: 95 },
    { id: 'tree-003', name: 'Bandra Kurla Complex, Mumbai', lat: 19.0655, lng: 72.8643, basePm: 75 },
    { id: 'tree-004', name: 'Cubbon Park, Bangalore', lat: 12.9779, lng: 77.5952, basePm: 35 },
    { id: 'tree-005', name: 'T Nagar, Chennai', lat: 13.0401, lng: 80.2335, basePm: 55 }
];

async function generateMockData() {
    console.log('Connecting to MongoDB...');

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected! Generating mock data...');

        const data = [];
        const DAYS = 180; // 6 months

        // Generate one reading per day for the last 6 months for each location
        for (const loc of LOCATIONS) {
            let currentTempPm = loc.basePm;

            for (let i = DAYS; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                // Add random daily fluctuation
                const fluctuation = (Math.random() - 0.5) * 20;
                currentTempPm = Math.max(10, currentTempPm + fluctuation);

                data.push({
                    device_id: loc.id,
                    location_name: loc.name,
                    latitude: loc.lat,
                    longitude: loc.lng,
                    pm25: parseFloat(currentTempPm.toFixed(2)),
                    timestamp: date
                });
            }
        }

        // Insert in chunks of 500
        const CHUNK_SIZE = 500;
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            await AirQuality.insertMany(chunk);
            console.log(`Inserted ${chunk.length} records. Total: ${i + chunk.length}/${data.length}`);
        }

        console.log('Mock data generation complete!');
        process.exit(0);

    } catch (err) {
        console.error('Error generating data:', err);
        process.exit(1);
    }
}

generateMockData();
