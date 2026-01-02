const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - User login
router.post('/login', authController.login);

// POST /api/auth/logout - User logout
router.post('/logout', authController.logout);

// GET /api/auth/session - Get current session
router.get('/session', authController.getSession);

module.exports = router;
