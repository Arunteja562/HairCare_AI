// backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getRiskDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware'); // Optional auth middleware

// Route to get risk data for dashboard - add protect middleware if auth required
router.get('/risks', protect, getRiskDashboardData);


module.exports = router;
