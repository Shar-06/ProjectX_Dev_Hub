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
  
  test('getAllReports returns report list with success', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockReports = [{ id: 1, description: 'Leak in pipe' }];
    reportService.getAllReports.mockResolvedValueOnce(mockReports);
  
    await reportController.getAllReports(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockReports,
    });
    expect(reportService.getAllReports).toHaveBeenCalled();
  });
  
  test('getReportByID returns a report', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockReport = { id: 1, description: 'Water leak' };
    reportService.getReportByID.mockResolvedValueOnce(mockReport);
  
    await reportController.getReportByID(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockReport,
    });
    expect(reportService.getReportByID).toHaveBeenCalledWith('1');
  });
  
 /* test('getReportByFacility returns reports for a facility', async () => {
    const req = httpMocks.createRequest({ params: { name: 'Community Hall' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockFacilityReports = [{ id: 1, facility: 'Community Hall' }];
    reportService.getReportByFacility.mockResolvedValueOnce(mockFacilityReports);
  
    await reportController.getReportByFacility(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockFacilityReports,
    });
    expect(reportService.getReportByFacility).toHaveBeenCalledWith('Community Hall');
  });*/
  
  test('patchNewStatus updates report status', async () => {
    const req = httpMocks.createRequest({ params: { id: '1', status: 'resolved' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUpdatedReport = { id: 1, status: 'resolved' };
    reportService.patchReportStatus.mockResolvedValueOnce(mockUpdatedReport);
  
    await reportController.patchNewStatus(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUpdatedReport,
    });
    expect(reportService.patchReportStatus).toHaveBeenCalledWith('1', 'resolved');
  });
  
  test('postNewReport inserts report and returns response', async () => {
    const req = httpMocks.createRequest({
      body: {
        id: 'r1',
        status: 'new',
        feedback: '',
        facility_id: 'f1',
        resident_id: 'u1',
        equipment: 'Sink',
        description: 'Broken faucet',
        problem_group: 'Plumbing'
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockReport = { id: 'r1', description: 'Broken faucet' };
    reportService.postNewReport.mockResolvedValueOnce(mockReport);
  
    await reportController.postNewReport(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockReport,
    });
    expect(reportService.postNewReport).toHaveBeenCalledWith(
      'r1', 'new', '', 'f1', 'u1', 'Sink', 'Broken faucet', 'Plumbing'
    );
  });
  