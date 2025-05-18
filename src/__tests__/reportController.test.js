jest.mock('../api/services/reportService', () => ({
    getAllReports: jest.fn(),
    getReportByID: jest.fn(),
    getReportByFacility: jest.fn(),
    patchReportStatus: jest.fn(),
    postNewReport: jest.fn(),
}));

const reportController = require('../api/controllers/reportController');
const reportService = require('../api/services/reportService');
const httpMocks = require('node-mocks-http');

test('getAllReports returns a list of reports with 200 status', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockReports = [{ id: 1, facility_id: 101, description: 'Leak' }];
    reportService.getAllReports.mockResolvedValueOnce(mockReports);

    await reportController.getAllReports(req, res, next);

    expect(res._getJSONData()).toEqual({
        success: true,
        data: mockReports,
    });
    expect(res.statusCode).toBe(200);
    expect(reportService.getAllReports).toHaveBeenCalled();
});

test('getReportByID returns a single report with 200 status', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockReport = { id: 1, facility_id: 101, description: 'Leak' };
    reportService.getReportByID.mockResolvedValueOnce(mockReport);

    await reportController.getReportByID(req, res, next);

    expect(res._getJSONData()).toEqual({
        success: true,
        data: mockReport,
    });
    expect(reportService.getReportByID).toHaveBeenCalledWith('1');
});

test('getReportByFacility returns a list of reports for a specific facility', async () => {
    const req = httpMocks.createRequest({ params: { name: 'Facility A' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockReports = [{ id: 1, facility_id: 101, description: 'Leak' }];
    reportService.getReportByFacility.mockResolvedValueOnce(mockReports);

    await reportController.getReportByFacility(req, res, next);

    expect(res._getJSONData()).toEqual({
        success: true,
        data: mockReports,
    });
    expect(reportService.getReportByFacility).toHaveBeenCalledWith('Facility A');
});

test('patchNewStatus updates the status of a report', async () => {
    const req = httpMocks.createRequest({ params: { id: '1', status: 'closed' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockUpdatedReport = { id: 1, status: 'closed' };
    reportService.patchReportStatus.mockResolvedValueOnce(mockUpdatedReport);

    await reportController.patchNewStatus(req, res, next);

    expect(res._getJSONData()).toEqual({
        success: true,
        data: mockUpdatedReport,
    });
    expect(reportService.patchReportStatus).toHaveBeenCalledWith('1', 'closed');
});

test('postNewReport inserts a new report and returns 200 status', async () => {
    const req = httpMocks.createRequest({
        body: { facility_id: 101, resident_id: 202, description: 'Leak', date: '2025-05-18' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockReport = { facility_id: 101, resident_id: 202, description: 'Leak', date: '2025-05-18' };
    reportService.postNewReport.mockResolvedValueOnce(mockReport);

    await reportController.postNewReport(req, res, next);

    expect(res._getJSONData()).toEqual({
        success: true,
        data: mockReport,
    });
    expect(reportService.postNewReport).toHaveBeenCalledWith(101, 202, 'Leak', '2025-05-18');
});
