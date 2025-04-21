const data = require('../../config/database');

class bookingService {
    async getAllBookings() {
        const query = 'SELECT * FROM Booking ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getBookingById(id) {
        const query = {
            text: 'SELECT * FROM Booking WHERE id = $1',
            values: [id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async patchBookingStatus(id,status) {
        const query = {
            text: 'UPDATE Booking SET status = $2 Where id = $1 Returning *',
            values: [id,status]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('Booking not found');
        }
    
        return result.rows[0];
    }

    async postNewBooking(id,start_time,end_time,status,date,facility_id,resident_id) {

        const query = {
            text: 'INSERT INTO Booking (id,start_time,end_time,status,date,facility_id,resident_id) VALUES ($1,$2,$3,$4,$5,$6)',
            values: [id,start_time,end_time,status,date,facility_id,resident_id]
        };

        try {
            const result = await data.query(query);
    
            return result.rows;
        } catch (error) {
            if (error.code === '23505') {
                return { error: 'Booking already exists.' };
            }
    

        return result.rows;
    }
}


    
}

module.exports = new userService();