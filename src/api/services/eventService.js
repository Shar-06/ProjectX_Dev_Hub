const data = require('../../config/database');

class eventService {

    async getAllEvents() {
        const query = 'SELECT * FROM "Event" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async postNewEvent(id,title,description,timeslot,facility_id,date,host,imageURL) {

        const query = {
            text: 'INSERT INTO "Event" (id,title,description,timeslot,facility_id,date,host,imageURL) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
            values: [id,title,description,timeslot,facility_id,date,host,imageURL]
        };

        try {
            const result = await data.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error inserting event", error);
            throw error;
    }
}

    
}

module.exports = new eventService();