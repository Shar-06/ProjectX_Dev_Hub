jest.mock('../api/services/usagetrendsService', () => ({
  getUsageComparison: jest.fn(),
  getTotalBookings: jest.fn(),
  getPopularFacility: jest.fn(),
  getTotalHours: jest.fn(),
  getUsageByFacility: jest.fn()
}));

const usageTrendsController = require('../api/controllers/usagetrendsController');
const usageTrendsService = require('../api/services/usagetrendsService');
const httpMocks = require('node-mocks-http');

test('getUsageComparison returns usage comparison data', async () => {
  const req = httpMocks.createRequest({ params: { startDate: '2024-01-01', endDate: '2024-01-31' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ name: 'Gym', count: 10, date: '2024-01-05' }];
  usageTrendsService.getUsageComparison.mockResolvedValueOnce(mockData);

  await usageTrendsController.getUsageComparison(req, res, next);

  expect(res._getJSONData()).toEqual({ success: true, data: mockData });
  expect(usageTrendsService.getUsageComparison).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
});

test('getTotalBookings returns total booking stats', async () => {
  const req = httpMocks.createRequest({ params: { startDate: '2024-01-01', endDate: '2024-01-31' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ total_bookings: 5, overall_bookings: 20 }];
  usageTrendsService.getTotalBookings.mockResolvedValueOnce(mockData);

  await usageTrendsController.getTotalBookings(req, res, next);

  expect(res._getJSONData()).toEqual({ success: true, data: mockData });
  expect(usageTrendsService.getTotalBookings).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
});

test('getPopularFacility returns most used facility', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ name: 'Tennis Court', total_bookings: 50, percentage: 45.6 }];
  usageTrendsService.getPopularFacility.mockResolvedValueOnce(mockData);

  await usageTrendsController.getPopularFacility(req, res, next);

  expect(res._getJSONData()).toEqual({ success: true, data: mockData });
  expect(usageTrendsService.getPopularFacility).toHaveBeenCalled();
});

test('getTotalHours returns total usage hours', async () => {
  const req = httpMocks.createRequest({ params: { startDate: '2024-01-01', endDate: '2024-01-31' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ total_hours: 40, overall_hours: 100 }];
  usageTrendsService.getTotalHours.mockResolvedValueOnce(mockData);

  await usageTrendsController.getTotalHours(req, res, next);

  expect(res._getJSONData()).toEqual({ success: true, data: mockData });
  expect(usageTrendsService.getTotalHours).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
});

test('getUsageByFacility returns facility-specific usage data', async () => {
  const req = httpMocks.createRequest({ params: { startDate: '2024-01-01', endDate: '2024-01-31', facilityId: '2' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ name: 'Swimming Pool', count: 12, date: '2024-01-15' }];
  usageTrendsService.getUsageByFacility.mockResolvedValueOnce(mockData);

  await usageTrendsController.getUsageByFacility(req, res, next);

  expect(res._getJSONData()).toEqual({ success: true, data: mockData });
  expect(usageTrendsService.getUsageByFacility).toHaveBeenCalledWith('2024-01-01', '2024-01-31', '2');
});
