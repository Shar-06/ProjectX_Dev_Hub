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
            text: 'SELECT * FROM "MaintenanceReport","Facility" WHERE (MaintenanceReport.id = Facility.id) and (name = $1)',
            values: [facility_id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('MaintenanceReport not found');
        }

        return result.rows[0];
    }

    async postNewReport(id,status,feedback,facility_id,resident_id,equipment,description,problem_group) {

        const query = {
            text: 'INSERT INTO "MaintenanceReport" (status,feedback,facility_id,resident_id,equipment,description,problem_group) VALUES ($1,$2,$3,$4,$5,$6,$7)'
            +'Returning *',
            values: [status,feedback,facility_id,resident_id,equipment,description,problem_group]
        };

        try {
            const result = await data.query(query);
            return result.rows;
        } catch (error) {

        console.error("Error insterting report");
    }
}


async patchReportStatus(id,status) {

    const query = {
        text: 'Update "MaintenanceReport" set status = $2 where id = $1',
        values: [id,status]
    };

    try {
        const result = await data.query(query);

        return result.rows;
    } catch (error) {

    return result.rows;
}
}


    
}

module.exports = new reportService();