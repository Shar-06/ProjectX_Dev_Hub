const express = require('express');
const usageTrendsController = require('../controllers/usagetrendsController');
const router = express.Router();

router.get('/usage/:startDate/:endDate/:facilityId', usageTrendsController.getUsageByFacility);
router.get('/usage-comparison/:startDate/:endDate', usageTrendsController.getUsageComparison);
router.get('/total-bookings/:startDate/:endDate', usageTrendsController.getTotalBookings);
router.get('/popular-facility', usageTrendsController.getPopularFacility);
router.get('/total-hours/:startDate/:endDate', usageTrendsController.getTotalHours);

module.exports = router;