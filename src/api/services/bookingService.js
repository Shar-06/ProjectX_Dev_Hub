const data = require('../../config/database');

class bookingService {
    async getAllBookings() {
        const query = 'SELECT b.id,date,facility_id,status,timeslot,email,name,role FROM "Booking" as b,"User" as u where u.id = b.resident_id ORDER BY date, timeslot ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getBookingsByResidentId(residentId) {
        const query = {
            text: 'SELECT * FROM "Booking" WHERE resident_id = $1 ORDER BY date, timeslot',
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

async postNewBooking(date, facility_id, resident_id, timeslot) {
        
        const query = {
            text: 'INSERT INTO "Booking" (date, facility_id, resident_id, status, timeslot) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [ date, facility_id, resident_id,'Pending', timeslot]
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