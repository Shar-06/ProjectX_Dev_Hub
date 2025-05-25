const data = require('../../config/database');
const moment = require('moment');

class reportService {

    async getAllReports() {
        const query = `SELECT m.id,description,status,u.name as user,f.name as facility FROM "MaintenanceReport" as m, "User" as u, "Facility" as f WHERE m.resident_id = u.id AND facility_id = f.id ORDER BY case status WHEN 'not_started' THEN 1 WHEN 'ongoing' THEN 2 WHEN 'completed' THEN 3 ELSE 4 END`;
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

    async postNewReport(facility_id, resident_id, description) {
        const created_date = moment().format('YYYY-MM-DD');
        const query = {
            text: `Insert into "MaintenanceReport" (status,facility_id,resident_id,description,created_date) values ($1,$2,$3,$4,$5) returning *`,
            values: ['not-started', facility_id, resident_id, description, created_date]
        };

        try {
            const result = await data.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error inserting report:", error);
            throw new Error("Error inserting report into the database");
        }
    }

    async patchReportStatus(id, status, facilitystaff_id) {
    const query = {
        text: `UPDATE "MaintenanceReport" 
               SET status = $2 , completed_date = NOW(), facilitystaff_id = $3
               WHERE id = $1 
               RETURNING *`,
        values: [id, status, facilitystaff_id]
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
