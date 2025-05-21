const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();

// Public routes
router.get('/', reportController.getAllReports);
router.get('/id/:id', reportController.getReportByID);
//router.patch('/report/:id/:status',reportController.getReportByFacility);
router.patch('/updateStatus/:id/:status/:facilitystaff_id',reportController.patchNewStatus);
router.post('/postReport',reportController.postNewReport);

module.exports = router; 
