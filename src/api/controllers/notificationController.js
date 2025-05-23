const notificationService = require('../services/notificationService');

class notificationController{
    async getAllNotifications(req, res, next) {
        try {
            //fetch the list of notifications by calling the notificationService method (getAllNotifications)
            const notifications = await notificationService.getAllNotifications();
            
            //validation using if statement
            if (notifications) {
                res.json({
                    success: true,
                    data: notifications || []
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async getNotificationsByType(req, res, next) {
        try{
            const type = req.params.type;
            const notifications = await notificationService.getNotificationsByType(type);
            res.json({
                success: true,
                data: notifications || []
            });
        } catch (error) {
            next(error);
        }
    }
    async getNotificationsById(req, res, next) {
        try{
            const userid = req.params.userid;
            const type = req.params.type;
            const notifications = await notificationService.getNotificationsById(userid, type);
            res.json({
                success: true,
                data: notifications || []
            });
        } catch (error) {
            next(error);
        }
    }
    async postNewNotification(req, res, next) {
        try {
            const { date, timeslot, status, message, userid, type, username } = req.body;
            const notification = await notificationService.postNewNotification(date, timeslot, status, message, userid, type, username);
            res.json({
                success: true,
                data: notification
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new notificationController();
