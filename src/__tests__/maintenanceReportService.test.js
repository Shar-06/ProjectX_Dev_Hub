jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const maintenanceReportService = require('../api/services/maintenanceReportService');

describe('MaintenanceReportService', () => {
  test('getStatus returns grouped status counts', async () => {
    const mockRows = [
      { status: 'open', count: 5 },
      { status: 'completed', count: 3 },
    ];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await maintenanceReportService.getStatus();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith(
      'SELECT status,count(status) FROM "MaintenanceReport" GROUP BY status'
    );
  });

  test('getRecentMaintenance returns recent maintenance records ordered by status priority', async () => {
    const mockRows = [
      { name: 'Gym', description: 'Leak', status: 'open', created_date: '2024-01-01' },
    ];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await maintenanceReportService.getRecentMaintenance();
    expect(result).toEqual(mockRows);
  });

  test('getStaffLeaderBoard returns leaderboard with completed reports', async () => {
    const mockRows = [
      {
        name: 'John',
        completed_reports: 4,
        average_resolution_time: 2.5,
        relative_to_grand_count: 0.8,
      },
    ];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await maintenanceReportService.getStaffLeaderBoard();
    expect(result).toEqual(mockRows);
  });

  test('getAverageResolutionTime returns average resolution time', async () => {
    const mockRows = [{ average_resolution_time: 1.75 }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await maintenanceReportService.getAverageResolutionTime();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith(
      'SELECT ROUND(AVG(completed_date - created_date),2) AS average_resolution_time FROM "MaintenanceReport" WHERE status = \'completed\''
    );
  });

  test('issues_by_facility returns grouped issues by facility and date', async () => {
    const mockRows = [
      { count: 2, name: 'Soccer Field', created_date: '2024-01-01' },
      { count: 1, name: 'Gymnasium', created_date: '2024-01-02' },
    ];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await maintenanceReportService.issues_by_facility();
    expect(result).toEqual(mockRows);
  });

  test('issues_by_facility returns empty array if no issues found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });

    const result = await maintenanceReportService.issues_by_facility();
    expect(result).toEqual([]);
  });
});
