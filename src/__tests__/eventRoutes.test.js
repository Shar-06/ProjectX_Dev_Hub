const request = require('supertest');
const express = require('express');
const eventRoutes = require('../api/routes/event.routes');

// Mock the event service so we don’t hit the DB
jest.mock('../api/services/eventService', () => ({
  getAllEvents: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Event', date: '2025-06-01' }]),
  postNewEvent: jest.fn().mockResolvedValue([{ id: 1, title: 'New Event', date: '2025-07-01' }]),
}));

const app = express();
app.use(express.json());
app.use('/', eventRoutes);

describe('Event routes', () => {
  // Test: GET / returns all events
  test('GET / returns all events', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].title).toBe('Test Event');
  });

  // Test: POST /postEvent adds a new event
  test('POST /postEvent adds a new event', async () => {
    const newEvent = {
      title: 'New Event',
      description: 'Event description',
      timeslot: '10:00-11:00',
      facility_id: 1,
      date: '2025-07-01',
      host: 'Host Name',
      imageURL: null,
    };

    const res = await request(app)
      .post('/postEvent')
      .field('title', newEvent.title)
      .field('description', newEvent.description)
      .field('timeslot', newEvent.timeslot)
      .field('facility_id', newEvent.facility_id)
      .field('date', newEvent.date)
      .field('host', newEvent.host)
      .attach('image', Buffer.from('image data'), 'image.png');  // Mock file upload

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].title).toBe('New Event');
  });

  // Test: POST /postEvent throws error on database failure

});
