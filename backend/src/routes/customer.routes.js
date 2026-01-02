const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// All customer routes require authentication and CUSTOMER role
// (ADMIN can also access these routes)

/**
 * @route   GET /api/customer/trip-info
 * @desc    Get current trip information
 * @access  Customer, Admin
 */
router.get('/trip-info',
    auth,
    requireRole(['CUSTOMER', 'ADMIN']),
    customerController.getTripInfo
);

/**
 * @route   GET /api/customer/seat-availability
 * @desc    Get available seats count
 * @access  Customer, Admin
 */
router.get('/seat-availability',
    auth,
    requireRole(['CUSTOMER', 'ADMIN']),
    customerController.getSeatAvailability
);

/**
 * @route   GET /api/customer/live-status
 * @desc    Get live bus status
 * @access  Customer, Admin
 */
router.get('/live-status',
    auth,
    requireRole(['CUSTOMER', 'ADMIN']),
    customerController.getLiveStatus
);

/**
 * @route   GET /api/customer/seat-map
 * @desc    Get read-only seat map
 * @access  Customer, Admin
 */
router.get('/seat-map',
    auth,
    requireRole(['CUSTOMER', 'ADMIN']),
    customerController.getSeatMap
);

module.exports = router;
