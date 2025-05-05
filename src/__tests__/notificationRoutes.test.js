const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../api/routes/notification.routes');

// Mock the service so we don’t hit the DB
jest.mock('../api/services/notificationService', () => ({
  getAllNotifications: jest.fn().mockResolvedValue([{ id: 1, message: 'Test notification' }]),
  getNotificationsByType: jest.fn().mockResolvedValue([{ id: 2, type: 'info', message: 'Type notification' }]),
  getNotificationsById: jest.fn().mockResolvedValue([{ id: 3, userid: '123', type: 'alert', message: 'User alert' }]),
  postNewNotification: jest.fn().mockResolvedValue({
    id: 4,
    date: '2025-05-05',
    timeslot: '12:00',
    status: 'unread',
    message: 'New notification',
    userid: '123',
    type: 'info',
    username: 'John',
  }),
}));

const app = express();
app.use(express.json());
app.use('/', notificationRoutes);

describe('Notification routes', () => {
  test('GET / returns notifications', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].message).toBe('Test notification');
  });

  test('GET /type/:type returns notifications by type', async () => {
    const res = await request(app).get('/type/info');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].type).toBe('info');
  });

  test('GET /id/type/:userid/:type returns user notifications by type', async () => {
    const res = await request(app).get('/id/type/123/alert');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].userid).toBe('123');
    expect(res.body.data[0].type).toBe('alert');
  });

  test('POST /post-notification adds new notification', async () => {
    const newNotification = {
      date: '2025-05-05',
      timeslot: '12:00',
      status: 'unread',
      message: 'New notification',
      userid: '123',
      type: 'info',
      username: 'John',
    };

    const res = await request(app).post('/post-notification').send(newNotification);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('New notification');
    expect(res.body.data.username).toBe('John');
  });
});
