const data = require('../../config/database');

class notificationService {
    async getAllNotifications() {
        const query = 'SELECT * FROM "Notification" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    };

    async getNotificationsByType(type) {
        const query = {
            text: 'SELECT * FROM "Notification" WHERE type = $1',
            values: [type]
        };
        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
    };

    async getNotificationsById(userid, type) {
        const query = {
            text: 'SELECT * FROM "Notification" WHERE userid = $1 AND type = $2',
            values: [userid, type]
        };
        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
    };

    async postNewNotification( date, timeslot, status, message, userid, type, username) {
        const query = {
            text: 'INSERT INTO "Notification" (date, timeslot, status, message, userid, type, username) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            values: [date, timeslot, status, message, userid, type, username]
        };

        try {
            const result = await data.query(query);
            return result.rows;
        } catch (error) {
            throw new Error('Error inserting notification: ' + error.message);
        }
    };

};

module.exports = new notificationService();