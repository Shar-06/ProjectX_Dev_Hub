// Mock the database query function
jest.mock('../config/database', () => ({
    query: jest.fn(),
}));

const data = require('../config/database');
const reportService = require('../api/services/reportService');

// getAllReports returns all reports
test('getAllReports returns all reports', async () => {
    const mockRows = [{ id: 1, facility_id: 101, description: 'Leak' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await reportService.getAllReports();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "MaintenanceReport" ORDER BY id ASC');
});

// getReportByID returns a single report if found
test('getReportByID returns a report if found', async () => {
    const mockReport = { id: 1, facility_id: 101, description: 'Leak' };
    data.query.mockResolvedValueOnce({ rows: [mockReport] });

    const result = await reportService.getReportByID(1);
    expect(result).toEqual(mockReport);
    expect(data.query).toHaveBeenCalledWith({
        text: 'SELECT * FROM "MaintenanceReport" WHERE id = $1',
        values: [1],
    });
});

// getReportByID throws an error if report is not found
test('getReportByID throws error if not found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(reportService.getReportByID(999)).rejects.toThrow('Maintenance Report not found');
});

// getReportByFacility returns a report for a specific facility
test('getReportByFacility returns a report for a specific facility', async () => {
    const mockReport = { id: 1, facility_id: 101, description: 'Leak' };
    data.query.mockResolvedValueOnce({ rows: [mockReport] });

    const result = await reportService.getReportByFacility('Facility A');
    expect(result).toEqual(mockReport);
    expect(data.query).toHaveBeenCalledWith({
        text: `SELECT * FROM "MaintenanceReport", "Facility" 
               WHERE (MaintenanceReport.facility_id = Facility.id) 
               AND (Facility.name = $1)`,
        values: ['Facility A'],
    });
});

// getReportByFacility throws an error if no reports are found for the facility
test('getReportByFacility throws error if no reports found for the facility', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(reportService.getReportByFacility('Facility A')).rejects.toThrow('MaintenanceReport not found');
});

// postNewReport inserts a new report and returns it
test('postNewReport inserts a new report', async () => {
    const mockReport = { facility_id: 101, resident_id: 202, description: 'Leak', date: '2025-05-18' };
    data.query.mockResolvedValueOnce({ rows: [mockReport] });

    const result = await reportService.postNewReport(101, 202, 'Leak', '2025-05-18');
    expect(result).toEqual(mockReport);
    expect(data.query).toHaveBeenCalledWith({
        text: `INSERT INTO "MaintenanceReport" 
               (status,facility_id,resident_id,description,date) 
               VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        values: ["Pending", 101, 202, 'Leak', '2025-05-18'],
    });
});

// postNewReport throws error on database failure (e.g., duplicate entry)
test('postNewReport throws error on database failure', async () => {
    const error = new Error('Some database error');
    data.query.mockRejectedValueOnce(error);

    await expect(reportService.postNewReport(101, 202, 'Leak', '2025-05-18')).rejects.toThrow(error);
});

// patchReportStatus updates a report status and returns it
test('patchReportStatus updates and returns a report', async () => {
    const mockUpdatedReport = { id: 1, status: 'closed' };
    data.query.mockResolvedValueOnce({ rows: [mockUpdatedReport] });

    const result = await reportService.patchReportStatus(1, 'closed');
    expect(result).toEqual(mockUpdatedReport);
    expect(data.query).toHaveBeenCalledWith({
        text: `UPDATE "MaintenanceReport" SET status = $2 WHERE id = $1 RETURNING *`,
        values: [1, 'closed'],
    });
});

// patchReportStatus throws error on database failure
test('patchReportStatus throws error if update fails', async () => {
    const error = new Error('Some database error');
    data.query.mockRejectedValueOnce(error);

    await expect(reportService.patchReportStatus(1, 'closed')).rejects.toThrow(error);
});
