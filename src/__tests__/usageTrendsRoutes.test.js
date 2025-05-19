const request = require('supertest');
const express = require('express');
const usageRoutes = require('../api/routes/usagetrend.routes');

// Mock the usageTrendsService to avoid hitting the DB
jest.mock('../api/services/usagetrendsService', () => ({
  getUsageComparison: jest.fn().mockResolvedValue([{ name: 'Gym', count: 10 }]),
  getTotalBookings: jest.fn().mockResolvedValue([{ total_bookings: 5 }]),
  getPopularFacility: jest.fn().mockResolvedValue([{ name: 'Basketball Court', total_bookings: 12 }]),
  getTotalHours: jest.fn().mockResolvedValue([{ total_hours: 40 }]),
  getUsageByFacility: jest.fn().mockResolvedValue([{ date: '2024-01-10', count: 3 }])
}));

const app = express();
app.use(express.json());
app.use('/', usageRoutes);

describe('Usage Trends Routes', () => {
  test('GET /usage/:startDate/:endDate/:facilityId returns usage by facility', async () => {
    const res = await request(app).get('/usage/2024-01-01/2024-01-31/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /usage-comparison/:startDate/:endDate returns usage comparison data', async () => {
    const res = await request(app).get('/usage-comparison/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].name).toBe('Gym');
  });

  test('GET /total-bookings/:startDate/:endDate returns total bookings', async () => {
    const res = await request(app).get('/total-bookings/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].total_bookings).toBe(5);
  });

  test('GET /popular-facility returns popular facility', async () => {
    const res = await request(app).get('/popular-facility');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].name).toBe('Basketball Court');
  });

  test('GET /total-hours/:startDate/:endDate returns total usage hours', async () => {
    const res = await request(app).get('/total-hours/2024-01-01/2024-01-31');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].total_hours).toBe(40);
  });
});
