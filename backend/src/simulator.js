const Bus = require('./models/Bus');

/**
 * GPS route paths for each bus (simple coordinate progression)
 */
const GPS_ROUTES = {
    'BUS-001': [ // Kochi Local circuit
        { lat: 9.9312, lng: 76.2673 },
        { lat: 9.9400, lng: 76.2700 },
        { lat: 9.9500, lng: 76.2750 },
        { lat: 9.9600, lng: 76.2800 },
        { lat: 9.9700, lng: 76.2850 },
        { lat: 9.9800, lng: 76.2900 }
    ],
    'BUS-002': [ // Kochi to Bengaluru (long route)
        { lat: 9.9312, lng: 76.2673 },  // Kochi
        { lat: 10.5276, lng: 76.2144 }, // Thrissur
        { lat: 10.9254, lng: 76.5518 }, // Palakkad
        { lat: 11.3410, lng: 76.7650 }, // Coimbatore
        { lat: 11.9139, lng: 79.8145 }, // Salem
        { lat: 12.9716, lng: 77.5946 }  // Bengaluru
    ],
    'BUS-003': [ // Airport Shuttle (short route)
        { lat: 9.9312, lng: 76.2673 },  // Kochi city
        { lat: 10.1520, lng: 76.3920 }, // Midpoint
        { lat: 10.1520, lng: 76.4010 }  // Airport
    ]
};

/**
 * Route indices to track GPS progression
 */
const routeIndices = {
    'BUS-001': 0,
    'BUS-002': 0,
    'BUS-003': 0
};

/**
 * Simulation interval reference
 */
let simulationInterval = null;

/**
 * Initialize/Seed the three buses with initial configurations
 */
const seedBuses = async () => {
    try {
        console.log('\n🌱 Seeding buses for multi-bus simulation...');

        // Drop existing buses
        await Bus.deleteMany({});
        console.log('   🗑️  Cleared existing buses');

        // Create initial seat states for each bus
        const createSeatStates = (capacity) => {
            const seats = [];
            for (let i = 1; i <= capacity; i++) {
                const rand = Math.random();
                let state;
                if (rand < 0.3) state = 'HUMAN';
                else if (rand < 0.4) state = 'LUGGAGE';
                else state = 'EMPTY';

                seats.push({ seatNumber: i, state });
            }
            return seats;
        };

        // Insert three distinct buses
        const buses = await Bus.insertMany([
            {
                busId: 'BUS-001',
                busNumber: 'KL-07-A-1001',
                route: 'Kochi Local',
                status: 'ONLINE',
                gpsLocation: GPS_ROUTES['BUS-001'][0],
                currentLocation: GPS_ROUTES['BUS-001'][0],
                currentStop: 'Ernakulam',
                nextStop: 'Marine Drive',
                estimatedArrival: new Date(Date.now() + 15 * 60 * 1000),
                departureTime: new Date(Date.now() - 10 * 60 * 1000),
                driverStatus: {
                    name: 'Rajesh Kumar',
                    present: true,
                    lastSeen: new Date(),
                    location: 'DRIVER_SEAT'
                },
                attenderStatus: {
                    name: 'Sunil Das',
                    present: true,
                    lastSeen: new Date(),
                    location: 'MIDDLE'
                },
                capacity: 30,
                seatStates: createSeatStates(30),
                passengerCount: 0, // Will be calculated
                lastUpdated: new Date()
            },
            {
                busId: 'BUS-002',
                busNumber: 'KL-07-B-2002',
                route: 'Kochi to Bengaluru',
                status: 'ONLINE',
                gpsLocation: GPS_ROUTES['BUS-002'][0],
                currentLocation: GPS_ROUTES['BUS-002'][0],
                currentStop: 'Kochi',
                nextStop: 'Thrissur',
                estimatedArrival: new Date(Date.now() + 90 * 60 * 1000),
                departureTime: new Date(Date.now() - 5 * 60 * 1000),
                driverStatus: {
                    name: 'Vijay Kumar',
                    present: true,
                    lastSeen: new Date(),
                    location: 'DRIVER_SEAT'
                },
                attenderStatus: {
                    name: 'Arun Babu',
                    present: true,
                    lastSeen: new Date(),
                    location: 'REAR'
                },
                capacity: 40,
                seatStates: createSeatStates(40),
                passengerCount: 0,
                lastUpdated: new Date()
            },
            {
                busId: 'BUS-003',
                busNumber: 'KL-07-C-3003',
                route: 'Airport Shuttle',
                status: 'ONLINE',
                gpsLocation: GPS_ROUTES['BUS-003'][0],
                currentLocation: GPS_ROUTES['BUS-003'][0],
                currentStop: 'City Center',
                nextStop: 'Airport',
                estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
                departureTime: new Date(Date.now() - 3 * 60 * 1000),
                driverStatus: {
                    name: 'Manoj Singh',
                    present: true,
                    lastSeen: new Date(),
                    location: 'DRIVER_SEAT'
                },
                attenderStatus: {
                    name: 'Ravi Kumar',
                    present: true,
                    lastSeen: new Date(),
                    location: 'FRONT'
                },
                capacity: 20,
                seatStates: createSeatStates(20),
                passengerCount: 0,
                lastUpdated: new Date()
            }
        ]);

        console.log(`   ✅ Created ${buses.length} buses:`);
        buses.forEach(bus => {
            console.log(`      - ${bus.busId}: ${bus.route} (${bus.capacity} seats)`);
        });

        console.log('🎉 Bus seeding completed!\n');

    } catch (error) {
        console.error('❌ Error seeding buses:', error);
        throw error;
    }
};

/**
 * Update GPS location for a bus along its route
 */
const updateGPSLocation = (busId) => {
    const route = GPS_ROUTES[busId];
    if (!route) return null;

    // Move to next coordinate in route
    routeIndices[busId] = (routeIndices[busId] + 1) % route.length;
    return route[routeIndices[busId]];
};

/**
 * Simulate seat state changes for BUS-001 (High Turnover)
 */
const simulateBus001 = (seatStates) => {
    return seatStates.map(seat => {
        // 40% chance of state change
        if (Math.random() < 0.4) {
            const rand = Math.random();
            if (rand < 0.50) return { ...seat, state: 'HUMAN' };
            else if (rand < 0.65) return { ...seat, state: 'LUGGAGE' };
            else return { ...seat, state: 'EMPTY' };
        }
        return seat;
    });
};

/**
 * Simulate seat state changes for BUS-002 (Stable with Luggage Mismatches)
 */
const simulateBus002 = (seatStates) => {
    return seatStates.map(seat => {
        // 20% chance of state change
        if (Math.random() < 0.2) {
            const rand = Math.random();
            // 30% chance of luggage mismatch
            if (rand < 0.30) return { ...seat, state: 'LUGGAGE' };
            else if (rand < 0.60) return { ...seat, state: 'HUMAN' };
            else return { ...seat, state: 'EMPTY' };
        }
        return seat;
    });
};

/**
 * Simulate seat state changes for BUS-003 (Mostly Empty/Human)
 */
const simulateBus003 = (seatStates) => {
    return seatStates.map(seat => {
        // 15% chance of state change
        if (Math.random() < 0.15) {
            const rand = Math.random();
            // 70% chance of empty, 25% human, 5% luggage
            if (rand < 0.70) return { ...seat, state: 'EMPTY' };
            else if (rand < 0.95) return { ...seat, state: 'HUMAN' };
            else return { ...seat, state: 'LUGGAGE' };
        }
        return seat;
    });
};

/**
 * Apply reconciliation rule: Human overrides Luggage in conflicts
 */
const applyReconciliation = (seatStates) => {
    // For now, this is a placeholder. In a real system, you'd compare
    // with sensor data. Here we just ensure consistency.
    return seatStates.map(seat => {
        // If luggage is detected but we have high confidence it's human, override
        if (seat.state === 'LUGGAGE' && Math.random() < 0.1) {
            return { ...seat, state: 'HUMAN' };
        }
        return seat;
    });
};

/**
 * Calculate passenger count from seat states
 */
const calculatePassengerCount = (seatStates) => {
    return seatStates.filter(seat => seat.state === 'HUMAN').length;
};

/**
 * Start global simulation - Updates all buses every 5 seconds
 */
const startGlobalSimulation = () => {
    console.log('🚀 Starting global multi-bus simulation...');
    console.log('   ⏱️  Update interval: 5 seconds\n');

    let updateCount = 0;

    simulationInterval = setInterval(async () => {
        try {
            updateCount++;
            console.log(`[Simulation Cycle #${updateCount}] ${new Date().toLocaleTimeString()}`);

            // Fetch all buses
            const buses = await Bus.find({ status: 'ONLINE' });

            for (const bus of buses) {
                let updatedSeatStates = [...bus.seatStates];

                // Apply bus-specific simulation logic
                if (bus.busId === 'BUS-001') {
                    updatedSeatStates = simulateBus001(updatedSeatStates);
                } else if (bus.busId === 'BUS-002') {
                    updatedSeatStates = simulateBus002(updatedSeatStates);
                } else if (bus.busId === 'BUS-003') {
                    updatedSeatStates = simulateBus003(updatedSeatStates);
                }

                // Apply reconciliation
                updatedSeatStates = applyReconciliation(updatedSeatStates);

                // Update GPS location
                const newGPS = updateGPSLocation(bus.busId);

                // Calculate passenger count
                const passengerCount = calculatePassengerCount(updatedSeatStates);

                // Update bus in database
                await Bus.findOneAndUpdate(
                    { busId: bus.busId },
                    {
                        seatStates: updatedSeatStates,
                        gpsLocation: newGPS || bus.gpsLocation,
                        currentLocation: newGPS || bus.currentLocation,
                        passengerCount,
                        lastUpdated: new Date()
                    }
                );

                console.log(`   ✓ ${bus.busId}: ${passengerCount}/${bus.capacity} passengers`);
            }

        } catch (error) {
            console.error('❌ Simulation error:', error);
        }
    }, 5000); // 5 second interval
};

/**
 * Stop the simulation
 */
const stopSimulation = () => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        console.log('⏹️  Simulation stopped');
    }
};

module.exports = {
    seedBuses,
    startGlobalSimulation,
    stopSimulation
};
