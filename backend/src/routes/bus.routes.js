const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/**
 * @route   GET /api/bus
 * @desc    Get all buses
 * @access  Admin
 */
router.get('/', auth, requireRole(['ADMIN']), busController.getAllBuses);

/**
 * @route   GET /api/bus/:id
 * @desc    Get single bus status
 * @access  Admin
 */
router.get('/:id', auth, requireRole(['ADMIN']), busController.getBusStatus);

/**
 * @route   GET /api/bus/:id/driver
 * @desc    Get driver status for a bus
 * @access  Admin
 */
router.get('/:id/driver', auth, requireRole(['ADMIN']), busController.getDriverStatus);

/**
 * @route   GET /api/bus/:id/attender
 * @desc    Get attender status for a bus
 * @access  Admin
 */
router.get('/:id/attender', auth, requireRole(['ADMIN']), busController.getAttenderStatus);

/**
 * @route   GET /api/bus/:id/seat-map
 * @desc    Get seat map for a bus
 * @access  Admin
 */
router.get('/:id/seat-map', auth, requireRole(['ADMIN']), busController.getSeatMap);

/**
 * @route   GET /api/bus/status (legacy endpoint)
 * @desc    Get first bus status
 * @access  Authenticated
 */
router.get('/status', auth, async (req, res) => {
    try {
        const Bus = require('../models/Bus');
        const bus = await Bus.findOne();
        res.json({ success: true, data: bus });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bus status' });
    }
});

/**
 * @route   GET /api/bus/seats (legacy endpoint)
 * @desc    Get seats for first bus
 * @access  Authenticated
 */
router.get('/seats', auth, async (req, res) => {
    try {
        const Seat = require('../models/Seat');
        const seats = await Seat.find();
        res.json({ success: true, data: seats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch seats' });
    }
});

/**
 * @route   POST /api/bus/snapshot
 * @desc    ESP32 pushes live data
 * @access  Public (IoT device)
 */
router.post('/snapshot', async (req, res) => {
    try {
        // Handle IoT data push
        console.log('Snapshot received:', req.body);
        res.json({ success: true, message: 'Snapshot received' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process snapshot' });
    }
});

module.exports = router;
