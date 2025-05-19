const request = require('supertest');
const express = require('express');
const reportingRoutes = require('../api/routes/reporting.routes');

// Mock the controller
jest.mock('../api/controllers/reportingController', () => ({
  most_popular_facility: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: { facility: 'Court A', count: 12 } })
  ),
  usage_charts: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: [{ date: '2024-01-01', count: 5 }] })
  ),
  usage_charts_byfacility: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: [{ date: '2024-01-01', count: 3 }] })
  ),
  issues_by_facility: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: [{ facility: 'Gym', issues: 2 }] })
  ),
  recent_maintenance_reports: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: [{ facility: 'Pool', status: 'Open' }] })
  ),
  recent_maintenance_reports_byFacility: jest.fn((req, res) =>
    res.status(200).json({ success: true, data: [{ facility: 'Field', status: 'Closed' }] })
  ),
}));

const app = express();
app.use(express.json());
app.use('/', reportingRoutes);

describe('Reporting routes', () => {
  test('GET /most-popular-facility/:start_date/:end_date', async () => {
    const res = await request(app).get('/most-popular-facility/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.facility).toBe('Court A');
  });

  test('GET /usage-chart/:start_date/:end_date', async () => {
    const res = await request(app).get('/usage-chart/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /usage-chart-byFacility/:start_date/:end_date/:facility_id', async () => {
    const res = await request(app).get('/usage-chart-byFacility/2024-01-01/2024-01-31/CourtA');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /issues-by-facility/:start_date/:end_date', async () => {
    const res = await request(app).get('/issues-by-facility/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].facility).toBe('Gym');
  });

  test('GET /recent-issues/:start_date/:end_date', async () => {
    const res = await request(app).get('/recent-issues/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].facility).toBe('Pool');
  });

  test('GET /recent-issues-by-facility/:start_date/:end_date/:facility_name', async () => {
    const res = await request(app).get('/recent-issues-by-facility/2024-01-01/2024-01-31/Field');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].facility).toBe('Field');
  });
});
