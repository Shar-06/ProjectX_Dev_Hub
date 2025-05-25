const data = require('../../config/database');

class reportingService {

   async most_popular_facility(start_date,end_date){

         const query = {
            text: 'SELECT count(*), name FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and date between $1 and $2 GROUP BY name ORDER BY count(*) desc',
            values: [start_date,end_date]
        };

        const result = await data.query(query);

        //return result.rows[0];

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows[0];
   } 

   async issues_by_facility(start_date,end_date){

      const query = {
            text: ' select count(*), name FROM "MaintenanceReport" as m, "Facility" as f where m.facility_id = f.id and created_date between $1 and $2 group by name order by count(*) desc',
            values: [start_date,end_date]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }

        async usage_chart_byfacility(start_date,end_date,facility_id){

         const query = {
            text: 'SELECT count(*), name, date FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and date between $1 and $2 and name = $3 GROUP BY name,date',
            values: [start_date,end_date,facility_id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }


       async usage_charts(start_date,end_date){

         const query = {
            text: 'SELECT count(*), name, date FROM "Booking" as b, "Facility" as f WHERE b.facility_id = f.id and date between $1 and $2 GROUP BY name, date ORDER BY date asc',
            values: [start_date,end_date]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }


   async recent_maintenance_reports(start_date,end_date){
    // this is for a time
         const query = {
            text: 'SELECT name,description,created_date,status FROM "MaintenanceReport" as mr, "Facility" as f WHERE mr.facility_id = f.id and created_date between $1 and $2 ORDER BY created_date desc;',
            values: [start_date,end_date]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }


   async recent_maintenance_reports_byFacility(start_date,end_date,facility_name){
    // this is for a time and a facility
         const query = {
            text: 'SELECT name,description,created_date,status FROM "MaintenanceReport" as mr, "Facility" as f WHERE mr.facility_id = f.id and created_date between $1 and $2 and name = $3 ORDER BY created_date desc',
            values: [start_date,end_date,facility_name]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }


}

module.exports = new reportingService();