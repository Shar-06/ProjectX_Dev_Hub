const request = require('supertest');
const express = require('express');
const userRoutes = require('../api/routes/user.routes');

// Mock the service so we don’t hit the DB
jest.mock('../api/services/userService', () => ({
  getAllUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'Test User' }]),
  getUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  getUserByName: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  patchUserRole: jest.fn().mockResolvedValue({ id: 1, role: 'admin' }),
  postNewUser: jest.fn().mockResolvedValue({ id: 'abc', name: 'John' }),
}));

const app = express();
app.use(express.json());
app.use('/', userRoutes);

describe('User routes', () => {
  test('GET / returns users', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /id/:id returns a user', async () => {
    const res = await request(app).get('/id/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test User');
  });

  test('PATCH /update-role/:id/:role updates user role', async () => {
    const res = await request(app).patch('/update-role/1/admin');
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('admin');
  });

  test('POST /post-user adds new user', async () => {
    const newUser = {
      uid: 'abc',
      email: 'john@example.com',
      displayName: 'John',
    };
    const res = await request(app)
      .post('/post-user')
      .send(newUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('John');
  });
});
