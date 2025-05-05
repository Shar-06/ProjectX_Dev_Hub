jest.mock('../config/database', () => ({
    query: jest.fn(),
  }));
  
  const data = require('../config/database');
  const reportService = require('../api/services/reportService');
  
  // getAllReports
  test('getAllReports returns all reports', async () => {
    const mockReports = [{ id: 1, description: 'Broken light' }];
    data.query.mockResolvedValueOnce({ rows: mockReports });
  
    const result = await reportService.getAllReports();
    expect(result).toEqual(mockReports);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "MaintenanceReport" ORDER BY id ASC');
  });
  
  // getReportByID success
  test('getReportByID returns report if found', async () => {
    const mockReport = { id: 1, description: 'Leaking pipe' };
    data.query.mockResolvedValueOnce({ rows: [mockReport] });
  
    const result = await reportService.getReportByID(1);
    expect(result).toEqual(mockReport);
  });
  
  // getReportByID not found
  test('getReportByID throws error if not found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(reportService.getReportByID(999)).rejects.toThrow('Maintenance Report not found');
  });
  
  // getReportByFacility success
  test('getReportByFacility returns report if found', async () => {
    const mockReport = { id: 2, name: 'Gym', description: 'AC not working' };
    data.query.mockResolvedValueOnce({ rows: [mockReport] });
  
    const result = await reportService.getReportByFacility('Gym');
    expect(result).toEqual(mockReport);
  });
  
  // getReportByFacility not found
  test('getReportByFacility throws error if not found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(reportService.getReportByFacility('NonExistentFacility')).rejects.toThrow('MaintenanceReport not found');
  });
  
  // postNewReport inserts report
  