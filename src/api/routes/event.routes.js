const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

// Public routes
router.get('/', eventController.getAllEvents);
//router.get('/id/:id', reportController.getReportByID);
//router.patch('/report/:id/:status',reportController.getReportByFacility);
router.post('/postEvent',eventController.postNewEvent);

module.exports = router; 
