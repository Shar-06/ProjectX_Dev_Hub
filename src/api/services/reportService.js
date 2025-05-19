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

    async getReportsByFacility(name) {
        const query = {
            text: `SELECT * FROM "MaintenanceReport" 
                   JOIN "Facility" ON "MaintenanceReport".facility_id = "Facility".id 
                   WHERE "Facility".name = $1`,
            values: [name]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('No maintenance reports found for this facility');
        }

        return result.rows;
    }

    async postNewReport(facility_id, resident_id, description, date) {
        const created_date = new Date();  // Use the current timestamp for created_date
        const completed_date = null;  // You can set this to null by default

        const query = {
            text: `INSERT INTO "MaintenanceReport" 
                   (status, facility_id, resident_id, description, created_date, completed_date) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: ["Pending", facility_id, resident_id, description, created_date, completed_date]
        };

        try {
            const result = await data.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error inserting report:", error);
            throw new Error("Error inserting report into the database");
        }
    }

    async patchReportStatus(id, status) {
    const query = {
        text: `UPDATE "MaintenanceReport" 
               SET status = $2 
               WHERE id = $1 
               RETURNING *`,
        values: [id, status]
    };

    try {
        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('Maintenance Report not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error updating report status:", error);
        throw new Error("Error updating the report status");
    }
}

}

module.exports = new reportService();
