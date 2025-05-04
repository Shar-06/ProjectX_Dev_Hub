const express = require('express');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

router.get('/', notificationController.getAllNotifications);
router.get('/type/:type', notificationController.getNotificationsByType);
router.get('/id/type/:userid/:type', notificationController.getNotificationsById);
router.post('/post-notification', notificationController.postNewNotification);

module.exports = router;