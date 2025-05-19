const express = require('express');
const maintenanceReportController = require('../controllers/maintenanceReportController');
const router = express.Router();

router.get('/status', maintenanceReportController.getStatus);
router.get('/recent', maintenanceReportController.getRecentMaintenance);
router.get('/staff-leaderboard', maintenanceReportController.getStaffLeaderBoard);
router.get('/average-resolution-time', maintenanceReportController.getAverageResolutionTime);
router.get('/issues-by-facility', maintenanceReportController.getIssuesByFacility);

module.exports = router;