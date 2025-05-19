jest.mock('../api/services/reportingService', () => ({
  most_popular_facility: jest.fn(),
  usage_charts: jest.fn(),
  usage_chart_byfacility: jest.fn(),
  issues_by_facility: jest.fn(),
  recent_maintenance_reports: jest.fn(),
  recent_maintenance_reports_byFacility: jest.fn(),
}));

const reportingService = require('../api/services/reportingService');
const reportingController = require('../api/controllers/reportingController');
const httpMocks = require('node-mocks-http');

test('most_popular_facility returns most popular facility', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockFacility = { name: 'Main Hall', count: 10 };
  reportingService.most_popular_facility.mockResolvedValueOnce(mockFacility);

  await reportingController.most_popular_facility(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockFacility,
  });
});

test('usage_charts returns usage data', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUsage = [{ date: '2024-01-01', count: 5 }];
  reportingService.usage_charts.mockResolvedValueOnce(mockUsage);

  await reportingController.usage_charts(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUsage,
  });
});

test('usage_charts_byfacility returns filtered usage data', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31', facility_id: 'Main Hall' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUsage = [{ date: '2024-01-02', count: 3 }];
  reportingService.usage_chart_byfacility.mockResolvedValueOnce(mockUsage);

  await reportingController.usage_charts_byfacility(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUsage,
  });
});

test('issues_by_facility returns issue data', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockIssues = [{ name: 'Gym', count: 2 }];
  reportingService.issues_by_facility.mockResolvedValueOnce(mockIssues);

  await reportingController.issues_by_facility(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockIssues,
  });
});

test('recent_maintenance_reports returns reports if found', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockReports = [{ name: 'Court A', status: 'Open' }];
  reportingService.recent_maintenance_reports.mockResolvedValueOnce(mockReports);

  await reportingController.recent_maintenance_reports(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockReports,
  });
});

test('recent_maintenance_reports returns empty array if no reports found', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  reportingService.recent_maintenance_reports.mockResolvedValueOnce([]);

  await reportingController.recent_maintenance_reports(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: [],
    message: 'No maintenance issues found for the selected date range.',
  });
});

test('recent_maintenance_reports_byFacility returns data', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31', facility_name: 'Pool' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockReports = [{ name: 'Pool', status: 'Resolved' }];
  reportingService.recent_maintenance_reports_byFacility.mockResolvedValueOnce(mockReports);

  await reportingController.recent_maintenance_reports_byFacility(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockReports,
  });
});

test('recent_maintenance_reports_byFacility returns empty if no results', async () => {
  const req = httpMocks.createRequest({
    params: { start_date: '2024-01-01', end_date: '2024-01-31', facility_name: 'Pool' },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  reportingService.recent_maintenance_reports_byFacility.mockResolvedValueOnce([]);

  await reportingController.recent_maintenance_reports_byFacility(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: [],
    message: 'No maintenance issues found for the selected date range and facility.',
  });
});
