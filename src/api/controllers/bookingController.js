const bookingService = require('../services/bookingService');

class bookingController {
    async getAllBookings(req, res, next) {
        try {
            const bookings = await bookingService.getAllBookings();
            res.json({
                success: true,
                data: bookings
            });
        } catch (error) {
            next(error);
        }
    }

    async getBookingsByResidentId(req, res, next) {
        try {
            const residentId = req.params.residentId;
            const bookings = await bookingService.getBookingsByResidentId(residentId);
            
            res.json({
                success: true,
                data: bookings
            });
        } catch (error) {
            next(error);
        }
    }

    async getBookingByID(req, res, next) {
        try {
            const id = req.params.id;
            const booking = await bookingService.getBookingByID(id);

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            next(error);
        }
    }

    async patchBookingStatus(req, res, next) {
        try {
            const id = req.params.id;
            const status = req.params.status;
            const booking = await bookingService.patchBookingStatus(id, status);

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            next(error);
        }
    }

    /*async postNewBooking(req, res, next) {
        try {
            const {start_time, end_time, status, date, facility_id, resident_id } = req.body;
            
            if (!start_time || !end_time || !date || !facility_id || !resident_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required booking fields'
                });
            }
    
            const booking = await bookingService.postNewBooking(
                start_time, end_time, status, 
                date, facility_id, resident_id
            );
    
            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Booking creation error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create booking'
            });
        }
    }*/

    async postNewBooking(req, res, next) {
        try {
            const {date,facility_id,resident_id,timeslot } = req.body;
            
            if (!date || !facility_id || !resident_id || !timeslot) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required booking fields'
                });
            }
    
            const booking = await bookingService.postNewBooking(
                date,facility_id,resident_id,timeslot
            );
    
            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Booking creation error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create booking'
            });
        }
    }
}

module.exports = new bookingController();