const data = require('../../config/database');

class reportingService {

   async most_popular_facility(start_date,end_date){
        const query = 'SELECT count(*), name FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and date IN  GROUP BY name ORDER BY count(*) desc';
        const result = await data.query(query);
        return result.rows;
   } 
}

module.exports = new reportingService();