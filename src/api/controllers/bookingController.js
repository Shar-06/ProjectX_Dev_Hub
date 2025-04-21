const bookingService = require('../services/bookingService');

class bookingController {
    async getAllBookings(req, res, next) {
        try {           
            //fetch the list of users by calling the userService method (getAllUsers)
            const bookings = await bookingService.getAllBookings();

            //validation using if statement
            if (users) {
                res.json({
                    success: true,
                    data: bookings
                });
            }

        } catch (error) {
            next(error);
        }
    }

    async getBookingByID(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;

            //use retrieved id to find brand using the service method
            const booking = await bookingService.getBookingByID();

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
            
            //retrieve id from request parameters
            const id = req.params.id;
            const status = req.params.status;

            //use retrieved id to find user using the service method
            const booking = await bookingService.patchBookingStatus(id,status);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    
    async postNewBooking(req, res, next) {
        try {
            
            const {id,start_time,end_time,status,date,facility_id,resident_id} = req.body;

            //use retrieved id to find user using the service method
            const booking = await bookingService.postNewBooking(id,start_time,end_time,status,date,facility_id,resident_id);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new userController();