const express = require('express');
const router = express.Router();
const accessLogsController = require('../controllers/accessLogsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All access log routes require ADMIN role

// GET /api/access-logs - Get access logs with filtering
router.get('/', auth, roleCheck(['ADMIN']), accessLogsController.getAccessLogs);

// GET /api/access-logs/stats - Get access statistics
router.get('/stats', auth, roleCheck(['ADMIN']), accessLogsController.getAccessStats);

// GET /api/access-logs/export - Export logs as CSV
router.get('/export', auth, roleCheck(['ADMIN']), accessLogsController.exportLogs);

module.exports = router;
