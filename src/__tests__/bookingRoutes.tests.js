const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../api/routes/booking.routes');

// Mock the service so we don’t hit the DB
jest.mock('../api/services/bookingService', () => ({
  getAllBookings: jest.fn().mockResolvedValue([{ id: 1, facility_id: 101 }]),
  getBookingsByResidentId: jest.fn().mockResolvedValue([{ id: 1, resident_id: 7 }]),
  getBookingByID: jest.fn().mockResolvedValue({ id: 1, date: '2025-05-01' }),
  patchBookingStatus: jest.fn().mockResolvedValue({ id: 1, status: 'Approved' }),
  postNewBooking: jest.fn().mockResolvedValue({ id: 1, status: 'Pending' }),
}));

const app = express();
app.use(express.json());
app.use('/', bookingRoutes);

describe('Booking routes', () => {
  test('GET / returns all bookings', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /resident/:residentId returns bookings by resident ID', async () => {
    const res = await request(app).get('/resident/7');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].resident_id).toBe(7);
  });

  test('GET /id/:id returns a booking by ID', async () => {
    const res = await request(app).get('/id/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.date).toBe('2025-05-01');
  });

  test('PATCH /update-status/:id/:status updates booking status', async () => {
    const res = await request(app).patch('/update-status/1/Approved');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Approved');
  });

  test('POST /post-booking creates a new booking', async () => {
    const newBooking = {
      date: '2025-06-01',
      facility_id: 2,
      resident_id: 3,
      timeslot: '10:00-11:00',
    };

    const res = await request(app).post('/post-booking').send(newBooking);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Pending');
  });
});
