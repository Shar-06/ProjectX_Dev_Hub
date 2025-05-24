/**
 * @jest-environment jsdom
 */
const moment = require('moment');

// Mock the API calls with fetch
global.fetch = jest.fn();

jest.mock('/api/v1/reporting/most-popular-facility', () => ({
  most_popular_facility: jest.fn(),
}));

jest.mock('/api/v1/reporting/usage-chart', () => ({
  usage_charts: jest.fn(),
}));

jest.mock('/api/v1/reporting/usage-chart-byFacility', () => ({
  usage_charts_byFacility: jest.fn(),
}));

jest.mock('/api/v1/reporting/issues-by-facility', () => ({
  issues_by_facility: jest.fn(),
}));

jest.mock('/api/v1/reporting/recent-issues', () => ({
  recent_maintenance_reports: jest.fn(),
}));

jest.mock('/api/v1/reporting/recent-issues-by-facility', () => ({
  recent_maintenance_reports_byFacility: jest.fn(),
}));

describe('Dashboard Event Listeners and API Calls', () => {
  let startDatePicked;
  let endDatePicked;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="facilities">
        <select class="facilities">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
      <div class="datePicker1"></div>
      <div class="timeRange"></div>
      <div class="datePicker2"></div>
      <div class="facilitySelector"></div>
      <div class="issuesTimeSelector"></div>
      <div class="datePicker3"></div>
      <div class="recentTimeSelector"></div>
      <div class="datePicker4"></div>
    `;

    startDatePicked = moment().subtract(1, 'week').format('YYYY-MM-DD');
    endDatePicked = moment().format('YYYY-MM-DD');

    // Mocking the fetch behavior for each API endpoint
    fetch.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call usage_charts with the correct date range when the timeRange is changed', async () => {
    const timeRangeSelect = document.querySelector('.timeRange');
    timeRangeSelect.value = '1';
    timeRangeSelect.dispatchEvent(new Event('change'));

    // Mock the response for usage_charts fetch
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith('/api/v1/reporting/usage-chart', expect.objectContaining({
      method: 'GET',
      body: JSON.stringify({ startDate: startDatePicked, endDate: endDatePicked }),
    }));
  });

  it('should call most_popular_facility with the correct date range when facilities selector is changed to "1"', async () => {
    const facilitiesSelect = document.querySelector('.facilities');
    facilitiesSelect.value = '1';
    facilitiesSelect.dispatchEvent(new Event('change'));

    // Mock the response for most_popular_facility fetch
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: { name: 'Gymnasium', count: 10 } }),
      ok: true,
    });

    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith('/api/v1/reporting/most-popular-facility', expect.objectContaining({
      method: 'GET',
      body: JSON.stringify({ startDate: startDatePicked, endDate: endDatePicked }),
    }));
  });

  it('should create a custom date picker for the facilities selector when value is "3"', () => {
    const facilitiesSelect = document.querySelector('.facilities');
    facilitiesSelect.value = '3';
    facilitiesSelect.dispatchEvent(new Event('change'));

    const datePicker = document.querySelector('.datePicker1');
    expect(datePicker.innerHTML).toContain('<input type="date" class="startDate">');
    expect(datePicker.innerHTML).toContain('<input type="date" class="endDate">');
  });

  it('should handle changing the issues time range and call issues_by_facility with correct parameters', async () => {
    const issuesTimeRange = document.querySelector('.issuesTimeSelector');
    issuesTimeRange.value = '1';
    issuesTimeRange.dispatchEvent(new Event('change'));

    // Mock the response for issues_by_facility fetch
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith('/api/v1/reporting/issues-by-facility', expect.objectContaining({
      method: 'GET',
      body: JSON.stringify({ startDate: startDatePicked, endDate: endDatePicked }),
    }));
  });

  it('should create a custom date picker for the issues time range selector when value is "3"', () => {
    const issuesTimeRange = document.querySelector('.issuesTimeSelector');
    issuesTimeRange.value = '3';
    issuesTimeRange.dispatchEvent(new Event('change'));

    const datePicker = document.querySelector('.datePicker3');
    expect(datePicker.innerHTML).toContain('<input type="date" class="startDate">');
    expect(datePicker.innerHTML).toContain('<input type="date" class="endDate">');
  });

  it('should call usage_charts_byFacility with correct parameters when facilitySelector is changed to "2"', async () => {
    const facilitySelector = document.querySelector('.facilitySelector');
    facilitySelector.value = '2'; // Select Gymnasium
    facilitySelector.dispatchEvent(new Event('change'));

    // Mock the response for usage_charts_byFacility fetch
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith('/api/v1/reporting/usage-chart-byFacility', expect.objectContaining({
      method: 'GET',
      body: JSON.stringify({ startDate: startDatePicked, endDate: endDatePicked, facility: 'Gymnasium' }),
    }));
  });

  it('should call recent_maintenance_reports when recentIssuesTimeRange is changed to "1"', async () => {
    const recentIssuesTimeRange = document.querySelector('.recentTimeSelector');
    recentIssuesTimeRange.value = '1';
    recentIssuesTimeRange.dispatchEvent(new Event('change'));

    // Mock the response for recent_maintenance_reports fetch
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: [] }),
      ok: true,
    });

    await Promise.resolve();

    expect(fetch).toHaveBeenCalledWith('/api/v1/reporting/recent-issues', expect.objectContaining({
      method: 'GET',
      body: JSON.stringify({ startDate: startDatePicked, endDate: endDatePicked }),
    }));
  });

  it('should create a custom date picker for the recent issues time range selector when value is "3"', () => {
    const recentIssuesTimeRange = document.querySelector('.recentTimeSelector');
    recentIssuesTimeRange.value = '3';
    recentIssuesTimeRange.dispatchEvent(new Event('change'));

    const datePicker = document.querySelector('.datePicker4');
    expect(datePicker.innerHTML).toContain('<input type="date" class="startDate">');
    expect(datePicker.innerHTML).toContain('<input type="date" class="endDate">');
  });

  // Test the behavior of most_popular_facility
  it('should handle most_popular_facility data correctly', async () => {
    const mockData = { data: { name: 'Gymnasium', count: 10 } };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
      ok: true,
    });

    const { most_popular_facility } = require('/api/v1/reporting/most-popular-facility');
    await most_popular_facility(startDatePicked, endDatePicked);

    const facilityNameElement = document.querySelector('.facilityName h2');
    expect(facilityNameElement.textContent).toBe('Gymnasium');
    expect(facilityNameElement).not.toBeNull();
  });

  // Test the behavior of issues_by_facility
  it('should handle issues_by_facility data correctly', async () => {
    const mockData = { data: [{ name: 'Gymnasium', count: 5 }] };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
      ok: true,
    });

    const { issues_by_facility } = require('/api/v1/reporting/issues-by-facility');
    await issues_by_facility(startDatePicked, endDatePicked);

    const chartContainer = document.querySelector('.issuesBarChartSection');
    expect(chartContainer.innerHTML).not.toContain('No Data Found for the selected range.');
  });

  // Test the behavior of recent_maintenance_reports
  it('should handle recent_maintenance_reports data correctly', async () => {
    const mockData = { data: [{ name: 'Gymnasium', description: 'Maintenance Issue', date: '2025-05-20', status: 'Resolved' }] };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
      ok: true,
    });

    const { recent_maintenance_reports } = require('/api/v1/reporting/recent-issues');
    await recent_maintenance_reports(startDatePicked, endDatePicked);

    const recentIssuesBody = document.querySelector('.recentIssuesBody');
    expect(recentIssuesBody.innerHTML).not.toContain('No Data Found for the selected range.');
  });
});
