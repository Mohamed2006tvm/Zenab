const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const uri = 'mongodb+srv://ns4600936_db_user:VobiTLq3UxbyhvfL@mern-zenab.cnftsfb.mongodb.net/?appName=mern-zenab';

console.log('Testing connection with forced Google DNS...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Connection successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
