const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// GET /api/analytics - Get analytics data (protected)
router.get('/', auth, analyticsController.getAnalytics);

// GET /api/analytics/performance - Get performance metrics (protected)
router.get('/performance', auth, analyticsController.getPerformance);

// GET /api/analytics/alerts - Get alerts (protected)
router.get('/alerts', auth, analyticsController.getAlerts);

module.exports = router;
