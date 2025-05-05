const data = require('../../config/database');

class bookingService {
    async getAllBookings() {
        const query = 'SELECT * FROM "Booking" ORDER BY date, time ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getBookingsByResidentId(residentId) {
        const query = {
            text: 'SELECT * FROM "Booking" WHERE resident_id = $1 ORDER BY date, time',
            values: [residentId]
        };

        const result = await data.query(query);
        return result.rows;
    }

    async getBookingByID(id) {
        const query = {
            text: 'SELECT * FROM "Booking" WHERE id = $1',
            values: [id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('Booking not found');
        }

        return result.rows[0];
    }

    async patchBookingStatus(id, status) {
        const query = {
            text: 'UPDATE "Booking" SET status = $2 WHERE id = $1 RETURNING *',
            values: [id, status]
        };

        const result = await data.query(query);

        if (result.rowCount === 0) {
            throw new Error('Booking not found');
        }

        return result.rows[0];
    }

    async postNewBooking(id, start_time, end_time, status, date, facility_id, resident_id) {
        const time = `${start_time}-${end_time}`;
        
        const query = {
            text: 'INSERT INTO "Booking" (id, date, facility_id, resident_id, status, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [id, date, facility_id, resident_id, status || 'Pending', time]
        };

        try {
            const result = await data.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Database error:', error);
            if (error.code === '23505') {
                throw new Error('Booking ID already exists');
            }
            throw new Error('Failed to create booking');
        }
    }
}

module.exports = new bookingService();