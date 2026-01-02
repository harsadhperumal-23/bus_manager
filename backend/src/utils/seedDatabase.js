require('dotenv').config();
const connectDB = require('../config/db');
const { seedAll } = require('./seedData');

/**
 * Standalone script to seed the database
 * Run with: node src/utils/seedDatabase.js
 */
const runSeed = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Run seeding
        await seedAll();

        console.log('✅ Seeding script completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding script failed:', error);
        process.exit(1);
    }
};

runSeed();
