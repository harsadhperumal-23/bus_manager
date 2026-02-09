const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const gpsController = require('../controllers/gpsController');
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
 * @route   GET /api/bus/:id/seats
 * @desc    Get seats for a specific bus
 * @access  Admin
 */
router.get('/:id/seats', auth, requireRole(['ADMIN']), busController.getSeatsForBus);

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
 * @route   POST /api/bus/location
 * @desc    Update GPS location from mobile phone
 * @access  Admin (driver)
 */
router.post('/location', auth, requireRole(['ADMIN']), gpsController.updateLocation);

/**
 * @route   POST /api/bus/snapshot
 * @desc    ESP32 or simulator pushes live data
 * @access  Public (IoT device)
 */
router.post('/snapshot', busController.updateSnapshot);

module.exports = router;
