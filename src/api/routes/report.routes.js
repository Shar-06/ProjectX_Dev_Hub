const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();

// Public routes
router.get('/', reportController.getAllReports);
router.get('/id/:id', reportController.getReportByID);
//router.patch('/report/:id/:status',reportController.getReportByFacility);
//router.post('/updateStatus',reportController.postNewStatus);

module.exports = router; 
