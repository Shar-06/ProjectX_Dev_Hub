const data = require('../../config/database');

class usageTrendsService {
    async getUsageComparison(startDate, endDate) {
        const query = {
            text: `
               SELECT count(*), name, date FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and date between $1 and $2 GROUP BY name, date ORDER BY count(*) desc
            `,
            values: [startDate, endDate]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No usage records found for the specified date range');
        }
        
        return result.rows;
    }
    async getUsageByFacility(startDate, endDate ,facilityId) {
        const query = {
            text: `
               SELECT count(*), name, date FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and facility_id = $3 and date between $1 and $2 GROUP BY name, date ORDER BY count(*) desc
            `,
            values: [startDate, endDate, facilityId]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No usage records found for the specified date range and facilityID');
        }
        
        return result.rows;
    }
    async getTotalBookings(startDate, endDate) {
        const query = {
            text: `
               SELECT count(status) as total_bookings,(select count(status) FROM "Booking" where status='Approved') AS overall_bookings FROM "Booking" where status='Approved' and date between $1 and $2`,
            values: [startDate, endDate]
        }
        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No usage records found for the specified date range');
        }
        return result.rows;
    }
    async getTotalHours(startDate, endDate) {
        const query = {
            text: `
               SELECT (select count(*) * 2 from "Booking" where status='Approved' and date between $1 and $2) +    (select count(id) * 2 from "Event" where date between $1 and $2) as total_hours, (select count(*) * 2 from "Booking" where status='Approved') +   (select count(id) * 2 from "Event") as overall_hours;`,
            values: [startDate, endDate]
        }
        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No usage records found for the specified date range');
        }
        return result.rows;
    }
    async getPopularFacility(){
        const query = {
            text:`
            SELECT f.name, COUNT(*) AS total_bookings,  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Booking" WHERE status = 'Approved'), 2) AS percentage FROM   "Facility" AS f JOIN   "Booking" AS b ON f.id = b.facility_id WHERE   b.status = 'Approved'GROUP BY   f.name ORDER BY   total_bookings DESC LIMIT 1;`,
            value: []
        }
        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No usage records found for the specified date range');
        }
        return result.rows;
    }
}

module.exports = new usageTrendsService();
