const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Dashboard routes
router.get('/dashboard', requireAuth, DashboardController.getDashboard);

module.exports = router; 