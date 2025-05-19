jest.mock('../api/services/maintenanceReportService', () => ({
  getStatus: jest.fn(),
  issues_by_facility: jest.fn(),
  getRecentMaintenance: jest.fn(),
  getStaffLeaderBoard: jest.fn(),
  getAverageResolutionTime: jest.fn(),
}));

const maintenanceReportController = require('../api/controllers/maintenanceReportController');
const maintenanceReportService = require('../api/services/maintenanceReportService');
const httpMocks = require('node-mocks-http');

describe('MaintenanceReportController', () => {
  test('getStatus returns status data', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockData = [{ status: 'open', count: 5 }];
    maintenanceReportService.getStatus.mockResolvedValueOnce(mockData);

    await maintenanceReportController.getStatus(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockData,
    });
    expect(res.statusCode).toBe(200);
    expect(maintenanceReportService.getStatus).toHaveBeenCalled();
  });

  test('getIssuesByFacility returns issue data', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockData = [{ name: 'Gym', count: 2 }];
    maintenanceReportService.issues_by_facility.mockResolvedValueOnce(mockData);

    await maintenanceReportController.getIssuesByFacility(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockData,
    });
    expect(res.statusCode).toBe(200);
    expect(maintenanceReportService.issues_by_facility).toHaveBeenCalled();
  });

  test('getRecentMaintenance returns recent maintenance data', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockData = [{ name: 'Field', status: 'open' }];
    maintenanceReportService.getRecentMaintenance.mockResolvedValueOnce(mockData);

    await maintenanceReportController.getRecentMaintenance(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockData,
    });
    expect(res.statusCode).toBe(200);
    expect(maintenanceReportService.getRecentMaintenance).toHaveBeenCalled();
  });

  test('getStaffLeaderBoard returns leaderboard data', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockData = [{ name: 'Alice', completed_reports: 4 }];
    maintenanceReportService.getStaffLeaderBoard.mockResolvedValueOnce(mockData);

    await maintenanceReportController.getStaffLeaderBoard(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockData,
    });
    expect(res.statusCode).toBe(200);
    expect(maintenanceReportService.getStaffLeaderBoard).toHaveBeenCalled();
  });

  test('getAverageResolutionTime returns average resolution time', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockData = [{ average_resolution_time: 2.5 }];
    maintenanceReportService.getAverageResolutionTime.mockResolvedValueOnce(mockData);

    await maintenanceReportController.getAverageResolutionTime(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockData,
    });
    expect(res.statusCode).toBe(200);
    expect(maintenanceReportService.getAverageResolutionTime).toHaveBeenCalled();
  });
});
