const Bus = require('../models/Bus');
const Seat = require('../models/Seat');

/**
 * Get current trip information for customers
 */
exports.getTripInfo = async (req, res) => {
    try {
        const bus = await Bus.findOne().sort({ createdAt: -1 });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }

        // Return customer-friendly trip information
        const tripInfo = {
            busNumber: bus.busNumber,
            route: bus.route,
            origin: bus.route?.origin || 'Kochi',
            destination: bus.route?.destination || 'Bengaluru',
            currentStop: bus.currentStop || 'In Transit',
            nextStop: bus.nextStop || 'Thrissur',
            estimatedArrival: bus.estimatedArrival || new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            status: bus.status || 'On Time',
            totalSeats: 40,
            departureTime: bus.departureTime || new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        };

        res.json({
            success: true,
            data: tripInfo
        });
    } catch (error) {
        console.error('Error fetching trip info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trip information'
        });
    }
};

/**
 * Get seat availability count for customers
 */
exports.getSeatAvailability = async (req, res) => {
    try {
        const seats = await Seat.find();

        const occupiedSeats = seats.filter(seat => seat.occupied).length;
        const availableSeats = 40 - occupiedSeats;

        res.json({
            success: true,
            data: {
                totalSeats: 40,
                occupiedSeats,
                availableSeats,
                occupancyPercentage: Math.round((occupiedSeats / 40) * 100)
            }
        });
    } catch (error) {
        console.error('Error fetching seat availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch seat availability'
        });
    }
};

/**
 * Get live bus status for customers
 */
exports.getLiveStatus = async (req, res) => {
    try {
        const bus = await Bus.findOne().sort({ createdAt: -1 });
        const seats = await Seat.find();

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }

        const occupiedSeats = seats.filter(seat => seat.occupied).length;

        const liveStatus = {
            isMoving: true,
            speed: Math.floor(Math.random() * 30) + 50, // 50-80 km/h
            currentLocation: bus.currentLocation || { lat: 10.1632, lng: 76.6413 },
            occupiedSeats,
            availableSeats: 40 - occupiedSeats,
            serviceStatus: bus.status || 'On Time',
            nextStop: bus.nextStop || 'Thrissur',
            etaToNextStop: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
            lastUpdated: new Date()
        };

        res.json({
            success: true,
            data: liveStatus
        });
    } catch (error) {
        console.error('Error fetching live status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch live status'
        });
    }
};

/**
 * Get read-only seat map for customers
 */
exports.getSeatMap = async (req, res) => {
    try {
        const seats = await Seat.find().sort({ seatNumber: 1 });

        // Return simplified seat data (no luggage detection details)
        const seatMap = seats.map(seat => ({
            seatNumber: seat.seatNumber,
            occupied: seat.occupied,
            row: Math.ceil(seat.seatNumber / 4),
            col: ((seat.seatNumber - 1) % 4) + 1
        }));

        res.json({
            success: true,
            data: {
                seats: seatMap,
                totalSeats: 40,
                layout: '2-2' // 2 seats on left, aisle, 2 seats on right
            }
        });
    } catch (error) {
        console.error('Error fetching seat map:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch seat map'
        });
    }
};
