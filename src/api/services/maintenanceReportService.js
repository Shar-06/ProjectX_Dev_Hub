const data = require('../../config/database');

class MaintenanceReportService {
    async getStatus() {
        const query = 'SELECT status,count(status) FROM "MaintenanceReport" GROUP BY status';
        const result = await data.query(query);
        return result.rows;
    }

    async getRecentMaintenance() {
        const query = `select name,description,status,created_date from "MaintenanceReport", "Facility"as f where facility_id = f.id order by case status WHEN 'not_started' THEN 1 WHEN 'ongoing' THEN 2 WHEN 'completed' THEN 3 ELSE 4 END`
        const result = await data.query(query);
        return result.rows;
    }

    async getStaffLeaderBoard(){
        const query = ` WITH grand_count AS ( SELECT COUNT(*) AS total_completed FROM "MaintenanceReport"  WHERE status = 'completed') SELECT u.name, COUNT(m.status) AS completed_reports, ROUND(AVG(m.completed_date - m.created_date), 2) AS average_resolution_time, ROUND( COUNT(m.status) * 1.0 / gc.total_completed, 2    ) AS relative_to_grand_count FROM "User" AS u JOIN "MaintenanceReport" AS m ON u.id = m.facilitystaff_id JOIN grand_count AS gc ON TRUE WHERE m.status = 'completed' GROUP BY u.name, gc.total_completed ORDER BY completed_reports DESC`;
        const result = await data.query(query);
        return result.rows;
    }
    async getAverageResolutionTime() {
        const query = `SELECT ROUND(AVG(completed_date - created_date),2) AS average_resolution_time FROM "MaintenanceReport" WHERE status = 'completed'`;
        const result = await data.query(query);
        return result.rows;
    }
    async issues_by_facility(){

      const query = ' select count(*), name,created_date FROM "MaintenanceReport" as m, "Facility" as f where m.facility_id = f.id group by name,created_date order by count(*) desc'

        const result = await data.query(query);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
   }
}

module.exports = new MaintenanceReportService();