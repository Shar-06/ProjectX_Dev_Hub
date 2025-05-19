const reportService = require('../api/services/reportService');
const db = require('../config/database');  // Assuming this is where db queries are made

jest.mock('../config/database'); // Mock the database module

describe('reportService', () => {
    beforeEach(() => {
        // Clear previous mocks
        db.query.mockClear();
    });

    test('should throw an error when inserting a report fails', async () => {
        // Mock db query failure
        db.query.mockRejectedValueOnce(new Error('Error inserting report into the database'));

        try {
            await reportService.postNewReport({
                // Example report data
                report_id: 1,
                description: 'Test report',
                status: 'Open'
            });
        } catch (error) {
            expect(error.message).toBe('Error inserting report into the database');
        }
    });

    test('should throw an error when updating report status fails', async () => {
        // Mock db query failure
        db.query.mockRejectedValueOnce(new Error('Error updating the report status'));

        try {
            await reportService.patchReportStatus(1, 'Completed');
        } catch (error) {
            expect(error.message).toBe('Error updating the report status');
        }
    });
});
