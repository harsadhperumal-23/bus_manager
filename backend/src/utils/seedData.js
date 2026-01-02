const User = require('../models/User');
const Bus = require('../models/Bus');
const Seat = require('../models/Seat');
const TripSnapshot = require('../models/TripSnapshot');
const Alert = require('../models/Alert');
const AccessLog = require('../models/AccessLog');
const bcrypt = require('bcryptjs');

/**
 * Seed all collections with sample data
 */
const seedAll = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Bus.deleteMany({});
        await Seat.deleteMany({});
        await TripSnapshot.deleteMany({});
        await Alert.deleteMany({});
        await AccessLog.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Seed Users
        const hashedPassword = await bcrypt.hash('password', 10);

        const users = await User.insertMany([
            {
                username: 'admin',
                email: 'admin@bus.com',
                password: hashedPassword,
                role: 'ADMIN',
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                username: 'viewer',
                email: 'viewer@bus.com',
                password: hashedPassword,
                role: 'VIEWER',
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                username: 'customer',
                email: 'customer@bus.com',
                password: hashedPassword,
                role: 'CUSTOMER',
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                username: 'passenger',
                email: 'passenger@bus.com',
                password: hashedPassword,
                role: 'CUSTOMER',
                createdAt: new Date(),
                lastLogin: new Date()
            }
        ]);

        console.log('✅ Created users:', users.length);

        // Seed Multiple Buses with Driver and Attender data
        const buses = await Bus.insertMany([
            {
                busId: 'BUS-001',
                busNumber: 'KL-07-AB-1234',
                route: 'Kochi → Bangalore',
                status: 'ONLINE',
                gpsLocation: { lat: 13.0827, lng: 80.2707 },
                currentLocation: { lat: 13.0827, lng: 80.2707 },
                currentStop: 'Thrissur',
                nextStop: 'Palakkad',
                estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000),
                departureTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                driverStatus: {
                    name: 'Ramesh Kumar',
                    present: true,
                    lastSeen: new Date(),
                    location: 'DRIVER_SEAT'
                },
                attenderStatus: {
                    name: 'Suresh Babu',
                    present: true,
                    lastSeen: new Date(),
                    location: 'MIDDLE'
                },
                passengerCount: 28,
                capacity: 40,
                lastUpdated: new Date()
            },
            {
                busId: 'BUS-002',
                busNumber: 'KL-07-CD-5678',
                route: 'Kochi → Chennai',
                status: 'ONLINE',
                gpsLocation: { lat: 12.9716, lng: 77.5946 },
                currentLocation: { lat: 12.9716, lng: 77.5946 },
                currentStop: 'Salem',
                nextStop: 'Chennai',
                estimatedArrival: new Date(Date.now() + 3 * 60 * 60 * 1000),
                departureTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
                driverStatus: {
                    name: 'Vijay Kumar',
                    present: true,
                    lastSeen: new Date(),
                    location: 'DRIVER_SEAT'
                },
                attenderStatus: {
                    name: 'Arun Das',
                    present: true,
                    lastSeen: new Date(),
                    location: 'REAR'
                },
                passengerCount: 35,
                capacity: 40,
                lastUpdated: new Date()
            },
            {
                busId: 'BUS-003',
                busNumber: 'KL-07-EF-9012',
                route: 'Kochi → Coimbatore',
                status: 'MAINTENANCE',
                gpsLocation: { lat: 10.8505, lng: 76.2711 },
                currentLocation: { lat: 10.8505, lng: 76.2711 },
                currentStop: 'Kochi Depot',
                nextStop: 'N/A',
                estimatedArrival: null,
                departureTime: null,
                driverStatus: {
                    name: 'Manoj Singh',
                    present: false,
                    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    location: 'OUTSIDE_BUS'
                },
                attenderStatus: {
                    name: 'Ravi Kumar',
                    present: false,
                    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    location: 'UNKNOWN'
                },
                passengerCount: 0,
                capacity: 40,
                lastUpdated: new Date()
            }
        ]);

        console.log('✅ Created buses:', buses.length);

        // Seed Seats (40 seats for first bus)
        const seats = [];
        const states = ['HUMAN', 'LUGGAGE', 'EMPTY'];

        for (let i = 1; i <= 40; i++) {
            // Randomize seat states with realistic distribution
            let state;
            const rand = Math.random();
            if (rand < 0.5) state = 'HUMAN';      // 50% human
            else if (rand < 0.65) state = 'LUGGAGE'; // 15% luggage
            else state = 'EMPTY';                 // 35% empty

            seats.push({
                busId: buses[0].busId,  // BUS-001
                seatNumber: i,
                state,
                lastUpdated: new Date()
            });
        }

        await Seat.insertMany(seats);
        console.log('✅ Created seats:', seats.length);

        // Seed Trip Snapshots (last 30 days)
        const snapshots = [];
        const now = new Date();

        for (let day = 30; day >= 0; day--) {
            const date = new Date(now);
            date.setDate(date.getDate() - day);

            // 3-5 snapshots per day
            const snapshotsPerDay = 3 + Math.floor(Math.random() * 3);

            for (let i = 0; i < snapshotsPerDay; i++) {
                const timestamp = new Date(date);
                timestamp.setHours(6 + i * 3, Math.floor(Math.random() * 60));

                const passengerCount = 10 + Math.floor(Math.random() * 25);
                const luggageSeats = Math.floor(Math.random() * 8);

                snapshots.push({
                    busId: buses[0].busId,  // BUS-001
                    passengerCount,
                    occupiedSeats: passengerCount,
                    luggageSeats,
                    timestamp
                });
            }
        }

        await TripSnapshot.insertMany(snapshots);
        console.log('✅ Created trip snapshots:', snapshots.length);

        // Seed Alerts
        const alertTypes = [
            { type: 'OVERCAPACITY', message: 'Bus exceeding capacity limit', severity: 'HIGH' },
            { type: 'TAMPERING', message: 'Sensor tampering detected', severity: 'HIGH' },
            { type: 'MISMATCH', message: 'Passenger count mismatch detected', severity: 'MEDIUM' },
            { type: 'DOOR_OPEN', message: 'Door opened while in motion', severity: 'MEDIUM' },
            { type: 'LOW_BATTERY', message: 'ESP32 battery low', severity: 'LOW' }
        ];

        const alerts = [];
        for (let day = 7; day >= 0; day--) {
            const date = new Date(now);
            date.setDate(date.getDate() - day);

            // 1-3 alerts per day
            const alertsPerDay = 1 + Math.floor(Math.random() * 3);

            for (let i = 0; i < alertsPerDay; i++) {
                const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                const timestamp = new Date(date);
                timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                alerts.push({
                    busId: buses[0].busId,  // BUS-001
                    type: alertType.type,
                    message: alertType.message,
                    severity: alertType.severity,
                    resolved: Math.random() > 0.3, // 70% resolved
                    timestamp
                });
            }
        }

        await Alert.insertMany(alerts);
        console.log('✅ Created alerts:', alerts.length);

        // Seed Access Logs (last 7 days)
        const actions = [
            'LOGIN', 'LOGOUT', 'VIEW_BUS_STATUS', 'VIEW_SEATS',
            'VIEW_ANALYTICS', 'VIEW_ACCESS_LOGS', 'VIEW_PERFORMANCE'
        ];

        const accessLogs = [];
        for (let day = 7; day >= 0; day--) {
            const date = new Date(now);
            date.setDate(date.getDate() - day);

            // 5-15 logs per day
            const logsPerDay = 5 + Math.floor(Math.random() * 11);

            for (let i = 0; i < logsPerDay; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const action = actions[Math.floor(Math.random() * actions.length)];
                const timestamp = new Date(date);
                timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                accessLogs.push({
                    userId: user._id.toString(),
                    username: user.username,
                    role: user.role,
                    action,
                    route: `/api/${action.toLowerCase().replace(/_/g, '/')}`,
                    method: 'GET',
                    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                    statusCode: 200,
                    responseTime: 50 + Math.floor(Math.random() * 200),
                    timestamp
                });
            }
        }

        await AccessLog.insertMany(accessLogs);
        console.log('✅ Created access logs:', accessLogs.length);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('   Admin: admin@bus.com / password');
        console.log('   Viewer: viewer@bus.com / password');
        console.log('   Customer: customer@bus.com / password');
        console.log('   Passenger: passenger@bus.com / password\n');

    } catch (error) {
        console.error('❌ Seeding error:', error);
        throw error;
    }
};

module.exports = { seedAll };
