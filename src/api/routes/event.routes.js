const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', eventController.getAllEvents);
//router.get('/id/:id', reportController.getReportByID);
//router.patch('/report/:id/:status',reportController.getReportByFacility);
router.post('/postEvent', upload.single('image'),eventController.postNewEvent);

module.exports = router; 
