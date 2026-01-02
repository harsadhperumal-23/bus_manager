// Mock Data Service - Centralized data generation and polling logic

// GPS Route: Kochi to Bengaluru (simplified waypoints)
export const busRoute = [
    [9.9312, 76.2673], // Kochi
    [10.1632, 76.6413], // Thrissur
    [10.5276, 76.2144], // Palakkad
    [11.0168, 76.9558], // Coimbatore
    [11.3410, 77.7172], // Salem
    [11.6643, 78.1460], // Dharmapuri
    [12.2958, 78.1594], // Hosur
    [12.9716, 77.5946], // Bengaluru
];

// Initial bus state
let currentBusData = {
    totalPassengers: 18,
    occupiedSeats: 18,
    luggageAlerts: 2,
    driverStatus: 'Active',
    currentRouteIndex: 0,
    latency: 24,
    seats: generateInitialSeats(),
    alerts: [],
};

// Generate initial seat configuration (40 seats)
function generateInitialSeats() {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
        const random = Math.random();
        const occupied = random > 0.5;
        const hasLuggage = random > 0.85;

        seats.push({
            number: i,
            occupied: occupied,
            passengerCount: occupied ? (Math.random() > 0.7 ? 2 : 1) : 0,
            hasLuggage: hasLuggage && occupied,
            lastUpdated: new Date().toISOString(),
            row: Math.ceil(i / 4),
            col: ((i - 1) % 4) + 1,
        });
    }
    return seats;
}

// Generate random bus metrics
export function generateBusMetrics() {
    const passengers = Math.floor(Math.random() * 8) + 15; // 15-22
    const luggage = Math.floor(Math.random() * 5); // 0-4
    const latency = Math.floor(Math.random() * 30) + 15; // 15-45ms

    currentBusData = {
        ...currentBusData,
        totalPassengers: passengers,
        occupiedSeats: passengers,
        luggageAlerts: luggage,
        driverStatus: Math.random() > 0.1 ? 'Active' : 'On Break',
        latency,
    };

    return currentBusData;
}

// Update bus position along route
export function updateBusPosition() {
    currentBusData.currentRouteIndex =
        (currentBusData.currentRouteIndex + 1) % busRoute.length;
    return busRoute[currentBusData.currentRouteIndex];
}

// Get current bus position
export function getCurrentBusPosition() {
    return busRoute[currentBusData.currentRouteIndex];
}

// Update random seats
export function updateSeats() {
    const newSeats = [...currentBusData.seats];
    const numChanges = Math.floor(Math.random() * 3) + 1; // 1-3 changes

    const newAlerts = [];

    for (let i = 0; i < numChanges; i++) {
        const randomIndex = Math.floor(Math.random() * 40);
        const random = Math.random();
        const oldSeat = newSeats[randomIndex];

        const occupied = random > 0.5;
        const hasLuggage = random > 0.85;

        newSeats[randomIndex] = {
            ...oldSeat,
            occupied: occupied,
            passengerCount: occupied ? (Math.random() > 0.7 ? 2 : 1) : 0,
            hasLuggage: hasLuggage && occupied,
            lastUpdated: new Date().toISOString(),
        };

        // Generate alert if luggage detected
        if (hasLuggage && occupied && !oldSeat.hasLuggage) {
            newAlerts.push({
                id: Date.now() + i,
                type: 'luggage',
                severity: 'warning',
                message: `Seat ${oldSeat.number}: Luggage Detected`,
                timestamp: new Date().toLocaleTimeString(),
            });
        } else if (occupied && !oldSeat.occupied) {
            newAlerts.push({
                id: Date.now() + i,
                type: 'passenger',
                severity: 'info',
                message: `Seat ${oldSeat.number}: Passenger Seated`,
                timestamp: new Date().toLocaleTimeString(),
            });
        }
    }

    currentBusData.seats = newSeats;

    // Add new alerts to the beginning
    if (newAlerts.length > 0) {
        currentBusData.alerts = [...newAlerts, ...currentBusData.alerts].slice(0, 20);
    }

    return { seats: newSeats, alerts: newAlerts };
}

// Get current seats (legacy)
export function getCurrentSeats() {
    return currentBusData.seats;
}

// Get seat data for SeatGrid component
export function getSeatData() {
    // Update seats periodically
    if (Math.random() > 0.7) {
        updateSeats();
    }
    return currentBusData.seats;
}

// Get recent alerts
export function getRecentAlerts() {
    // Occasionally add random critical alerts
    if (Math.random() > 0.95 && currentBusData.alerts.length < 20) {
        const criticalAlerts = [
            'Emergency: Driver assistance required',
            'Critical: Unauthorized access detected',
            'Emergency: Medical assistance needed',
        ];

        currentBusData.alerts.unshift({
            id: Date.now(),
            type: 'critical',
            severity: 'critical',
            message: criticalAlerts[Math.floor(Math.random() * criticalAlerts.length)],
            timestamp: new Date().toLocaleTimeString(),
        });
    }

    return currentBusData.alerts;
}

// Generate 24-hour on-time performance data
export function getOnTimePerformanceData() {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
        data.push({
            hour: `${hour}:00`,
            performance: Math.floor(Math.random() * 20) + 75, // 75-95%
        });
    }
    return data;
}

// Generate route efficiency data
export function getRouteData() {
    return [
        { route: 'Route 101', efficiency: 92, revenue: 4500 },
        { route: 'Route 102', efficiency: 88, revenue: 4200 },
        { route: 'Route 103', efficiency: 95, revenue: 5100 },
        { route: 'Route 104', efficiency: 85, revenue: 3800 },
        { route: 'Route 105', efficiency: 90, revenue: 4700 },
    ];
}

// Generate AI insights
export function generateAIInsights() {
    const insights = [
        'Peak luggage activity detected between 14:00-16:00',
        'Route 103 shows highest efficiency at 95%',
        'Average occupancy rate: 72% across all routes',
        'Driver performance optimal during morning hours',
        'Recommend additional monitoring for Route 104',
    ];

    const luggageCount = currentBusData.seats.filter(s => s.hasLuggage).length;
    const occupiedCount = currentBusData.seats.filter(s => s.occupied).length;

    const dynamicInsights = [];

    if (luggageCount > 3) {
        dynamicInsights.push(`High luggage alert: ${luggageCount} seats with luggage detected`);
    }

    if (occupiedCount > 30) {
        dynamicInsights.push('Bus is near capacity - consider additional service');
    }

    return [...dynamicInsights, ...insights.slice(0, 3)];
}

// Export current bus data
export function getCurrentBusData() {
    return currentBusData;
}
