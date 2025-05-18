const express = require('express');
const reportingController = require('../controllers/reportingController');
const router = express.Router();

// Public routes
router.get('/most-popular-facility/:start_date/:end_date', reportingController.most_popular_facility);
router.get('/usage-chart/:start_date/:end_date', reportingController.usage_charts);
router.get('/usage-chart-byFacility/:start_date/:end_date/:facility_id', reportingController.usage_charts_byfacility); 
router.get('/issues-by-facility/:start_date/:end_date', reportingController.issues_by_facility);
router.get('/recent-issues/:start_date/:end_date', reportingController.recent_maintenance_reports);
router.get('/recent-issues-by-facility/:start_date/:end_date/:facility_name', reportingController.recent_maintenance_reports_byFacility);

module.exports = router; 
