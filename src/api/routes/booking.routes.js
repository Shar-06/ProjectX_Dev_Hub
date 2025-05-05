const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// Public routes
router.get('/', bookingController.getAllBookings);
router.get('/resident/:residentId', bookingController.getBookingsByResidentId);
router.get('/id/:id', bookingController.getBookingByID);
router.patch('/update-status/:id/:status', bookingController.patchBookingStatus);
router.post('/post-booking', bookingController.postNewBooking);

module.exports = router;