jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const usageTrendsService = require('../api/services/usagetrendsService');

describe('usageTrendsService', () => {
  test('getUsageComparison returns rows when found', async () => {
    const mockRows = [{ count: 5, name: 'Court A', date: '2024-01-01' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await usageTrendsService.getUsageComparison('2024-01-01', '2024-01-31');
    expect(result).toEqual(mockRows);
  });

  test('getUsageComparison throws error when no rows found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      usageTrendsService.getUsageComparison('2024-01-01', '2024-01-31')
    ).rejects.toThrow('No usage records found for the specified date range');
  });

  test('getUsageByFacility returns rows when found', async () => {
    const mockRows = [{ count: 3, name: 'Gym', date: '2024-01-01' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await usageTrendsService.getUsageByFacility('2024-01-01', '2024-01-31', 1);
    expect(result).toEqual(mockRows);
  });

  test('getUsageByFacility throws error when no rows found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      usageTrendsService.getUsageByFacility('2024-01-01', '2024-01-31', 999)
    ).rejects.toThrow('No usage records found for the specified date range and facilityID');
  });

  test('getTotalBookings returns booking stats', async () => {
    const mockRows = [{ total_bookings: 5, overall_bookings: 20 }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await usageTrendsService.getTotalBookings('2024-01-01', '2024-01-31');
    expect(result).toEqual(mockRows);
  });

  test('getTotalBookings throws error when no rows found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      usageTrendsService.getTotalBookings('2024-01-01', '2024-01-31')
    ).rejects.toThrow('No usage records found for the specified date range');
  });

  test('getTotalHours returns total hours stats', async () => {
    const mockRows = [{ total_hours: 40, overall_hours: 100 }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await usageTrendsService.getTotalHours('2024-01-01', '2024-01-31');
    expect(result).toEqual(mockRows);
  });

  test('getTotalHours throws error when no rows found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      usageTrendsService.getTotalHours('2024-01-01', '2024-01-31')
    ).rejects.toThrow('No usage records found for the specified date range');
  });

  test('getPopularFacility returns most popular facility', async () => {
    const mockRows = [{ name: 'Field', total_bookings: 12, percentage: 60 }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await usageTrendsService.getPopularFacility();
    expect(result).toEqual(mockRows);
  });

  test('getPopularFacility throws error when no rows found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    await expect(usageTrendsService.getPopularFacility()).rejects.toThrow(
      'No usage records found for the specified date range'
    );
  });
});
