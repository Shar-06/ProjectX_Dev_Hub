const request = require('supertest');
const express = require('express');
const eventRoutes = require('../api/routes/event.routes');
const eventController = require('../api/controllers/eventController');

// Mock the eventController
jest.mock('../api/controllers/eventController', () => ({
  getAllEvents: jest.fn().mockResolvedValue([
    { id: 1, title: 'Event 1', description: 'Description 1', timeslot: '2025-05-05', facility_id: 1, date: '2025-05-06', host: 'Host 1', imageURL: 'url1' },
    { id: 2, title: 'Event 2', description: 'Description 2', timeslot: '2025-05-06', facility_id: 2, date: '2025-05-07', host: 'Host 2', imageURL: 'url2' }
  ]),
  postNewEvent: jest.fn().mockResolvedValue({
    id: 3,
    title: 'New Event',
    description: 'New Description',
    timeslot: '2025-05-10',
    facility_id: 3,
    date: '2025-05-11',
    host: 'New Host',
    imageURL: 'new_url',
  }),
}));

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

let server;

beforeAll(() => {
  server = app.listen(4000); // Start the server before running tests
});

afterAll(() => {
  server.close(); // Close the server after tests
});

describe('Event routes', () => {
 

  test('GET /events handles errors when getting events', async () => {
    // Mock rejection for getAllEvents
    const mockError = new Error('Database error');
    eventController.getAllEvents.mockRejectedValue(mockError);

    const res = await request(app).get('/events');

    expect(res.status).toBe(500); // Or whatever status your controller sends on error

  });
});
