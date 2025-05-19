const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../api/routes/notification.routes');

// Mock the service to avoid hitting the database
jest.mock('../api/services/notificationService', () => ({
  getAllNotifications: jest.fn().mockResolvedValue([{ id: 1, message: 'Test Notification' }]),
  getNotificationsByType: jest.fn().mockResolvedValue([{ id: 2, type: 'alert', message: 'Alert' }]),
  getNotificationsById: jest.fn().mockResolvedValue([{ id: 3, userid: 1, type: 'reminder', message: 'Reminder' }]),
  postNewNotification: jest.fn().mockResolvedValue({ id: 4, message: 'New Notification' }),
}));

const app = express();
app.use(express.json());
app.use('/', notificationRoutes);

describe('Notification routes', () => {
  test('GET / returns all notifications', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].message).toBe('Test Notification');
  });

  test('GET /type/:type returns notifications by type', async () => {
    const res = await request(app).get('/type/alert');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].type).toBe('alert');
  });

  test('GET /id/type/:userid/:type returns notifications by userid and type', async () => {
    const res = await request(app).get('/id/type/1/reminder');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].userid).toBe(1);
    expect(res.body.data[0].type).toBe('reminder');
  });

  test('POST /post-notification inserts a notification', async () => {
    const newNotification = {
      date: '2025-05-19',
      timeslot: '10:00',
      status: 'sent',
      message: 'New Notification',
      userid: 1,
      type: 'update',
      username: 'john',
    };

    const res = await request(app)
      .post('/post-notification')
      .send(newNotification);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('New Notification');
  });
});
