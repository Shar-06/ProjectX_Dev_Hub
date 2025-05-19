// reportingService.test.js

jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const reportingService = require('../api/services/reportingService'); // Adjust path if needed

// most_popular_facility
test('most_popular_facility returns most booked facility', async () => {
  const mockRow = { count: '5', name: 'Soccer Field' };
  data.query.mockResolvedValueOnce({ rows: [mockRow] });

  const result = await reportingService.most_popular_facility('2024-01-01', '2024-12-31');
  expect(result).toEqual(mockRow);
});

test('most_popular_facility throws error if no data found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  await expect(reportingService.most_popular_facility('2024-01-01', '2024-12-31'))
    .rejects.toThrow('No data found');
});

// issues_by_facility
test('issues_by_facility returns issue counts by facility and date', async () => {
  const mockRows = [{ count: '3', name: 'Tennis Court', created_date: '2024-03-01' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await reportingService.issues_by_facility('2024-01-01', '2024-12-31');
  expect(result).toEqual(mockRows);
});

test('issues_by_facility returns empty array if no issues found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  const result = await reportingService.issues_by_facility('2024-01-01', '2024-12-31');
  expect(result).toEqual([]);
});

// usage_chart_byfacility
test('usage_chart_byfacility returns bookings for facility over time', async () => {
  const mockRows = [{ count: '4', name: 'Gym', date: '2024-05-01' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await reportingService.usage_chart_byfacility('2024-01-01', '2024-12-31', 'Gym');
  expect(result).toEqual(mockRows);
});

test('usage_chart_byfacility returns empty array if no bookings found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  const result = await reportingService.usage_chart_byfacility('2024-01-01', '2024-12-31', 'Gym');
  expect(result).toEqual([]);
});

// usage_charts
test('usage_charts returns usage across all facilities over time', async () => {
  const mockRows = [{ count: '10', name: 'Hall', date: '2024-02-01' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await reportingService.usage_charts('2024-01-01', '2024-12-31');
  expect(result).toEqual(mockRows);
});

test('usage_charts returns empty array if no usage data', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  const result = await reportingService.usage_charts('2024-01-01', '2024-12-31');
  expect(result).toEqual([]);
});

// recent_maintenance_reports
test('recent_maintenance_reports returns maintenance logs', async () => {
  const mockRows = [{ name: 'Pool', description: 'Leak', created_date: '2024-06-01', status: 'Pending' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await reportingService.recent_maintenance_reports('2024-01-01', '2024-12-31');
  expect(result).toEqual(mockRows);
});

test('recent_maintenance_reports returns empty array if no reports', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  const result = await reportingService.recent_maintenance_reports('2024-01-01', '2024-12-31');
  expect(result).toEqual([]);
});

// recent_maintenance_reports_byFacility
test('recent_maintenance_reports_byFacility returns logs for given facility', async () => {
  const mockRows = [{ name: 'Tennis Court', description: 'Crack', created_date: '2024-06-01', status: 'Resolved' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await reportingService.recent_maintenance_reports_byFacility('2024-01-01', '2024-12-31', 'Tennis Court');
  expect(result).toEqual(mockRows);
});

test('recent_maintenance_reports_byFacility returns empty array if no logs', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  const result = await reportingService.recent_maintenance_reports_byFacility('2024-01-01', '2024-12-31', 'Tennis Court');
  expect(result).toEqual([]);
});
