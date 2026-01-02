const Bus = require('../models/Bus');

/**
 * Get all buses
 */
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().select('busId busNumber route status passengerCount capacity lastUpdated');

        res.json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch buses'
        });
    }
};

/**
 * Get single bus status
 */
exports.getBusStatus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ busId: req.params.id });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        console.error('Error fetching bus status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bus status'
        });
    }
};

/**
 * Get driver status for a bus
 */
exports.getDriverStatus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ busId: req.params.id }).select('driverStatus');

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        res.json({
            success: true,
            data: bus.driverStatus
        });
    } catch (error) {
        console.error('Error fetching driver status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch driver status'
        });
    }
};

/**
 * Get attender status for a bus
 */
exports.getAttenderStatus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ busId: req.params.id }).select('attenderStatus');

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        res.json({
            success: true,
            data: bus.attenderStatus
        });
    } catch (error) {
        console.error('Error fetching attender status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attender status'
        });
    }
};

/**
 * Get seat map for a bus
 */
exports.getSeatMap = async (req, res) => {
    try {
        const Seat = require('../models/Seat');
        const seats = await Seat.find({ busId: req.params.id }).sort({ seatNumber: 1 });

        res.json({
            success: true,
            data: {
                busId: req.params.id,
                totalSeats: 40,
                layout: '2-2',
                seats: seats
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
