const data = require('../../config/database');

class reportService {

    async getAllReports() {
        const query = 'SELECT * FROM "MaintenanceReport" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getReportByID(id) {
        const query = {
            text: 'SELECT * FROM "MaintenanceReport" WHERE id = $1',
            values: [id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('Maintenance Report not found');
        }

        return result.rows[0];
    }

    async getReportByFacility(name) {
        const query = {
            text: `SELECT * FROM "MaintenanceReport", "Facility" 
                   WHERE (MaintenanceReport.facility_id = Facility.id) 
                   AND (Facility.name = $1)`,
            values: [name]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('MaintenanceReport not found');
        }

        return result.rows[0];
    }

    async postNewReport(status, feedback, facility_id, resident_id, equipment, description, problem_group) {
        const query = {
            text: `INSERT INTO "MaintenanceReport" 
                   (status, feedback, facility_id, resident_id, equipment, description, problem_group) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            values: [status, feedback, facility_id, resident_id, equipment, description, problem_group]
        };

        try {
            const result = await data.query(query);
            return result.rows[0];  // Return the inserted row
        } catch (error) {
            console.error("Error inserting report:", error);
            throw error; // Rethrow the error after logging
        }
    }

    async patchReportStatus(id, status) {
        const query = {
            text: `UPDATE "MaintenanceReport" SET status = $2 WHERE id = $1 RETURNING *`,
            values: [id, status]
        };

        try {
            const result = await data.query(query);
            return result.rows[0];  // Return the updated row
        } catch (error) {
            console.error("Error updating report status:", error);
            throw error; // Rethrow the error after logging
        }
    }
}

module.exports = new reportService();
