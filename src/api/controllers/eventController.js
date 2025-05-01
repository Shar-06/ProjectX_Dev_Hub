const eventService = require('../services/eventService');

class eventController {
    async getAllEvents(req, res, next) {
        try {           
            //fetch the list of users by calling the userService method (getAllUsers)
            const events = await eventService.getAllEvents();

            //validation using if statement
            if (events) {
                res.json({
                    success: true,
                    data: events
                });
            }

        } catch (error) {
            next(error);
        }
    }

    async getEventByID(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;

            //use retrieved id to find brand using the service method
            const event = await eventService.getEventByID(id);

            res.json({
                success: true,
                data: event
            });
                
        } catch (error) {
            next(error);
        }
    }
    
    async postNewEvent(req, res, next) {
        try {
            
            const {id,title,description,timeslot,facility_id,date,host} = req.body;

            //use retrieved id to find user using the service method
            const event = await eventService.postNewEvent(id,title,description,timeslot,facility_id,date,host);

            res.json({
                success: true,
                data: event
            });
                
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new eventController();