jest.mock('../api/services/eventService', () => ({
  getAllEvents: jest.fn(),
  getEventByID: jest.fn(),
  postNewEvent: jest.fn(),
}));

const eventController = require('../api/controllers/eventController');
const eventService = require('../api/services/eventService');
const httpMocks = require('node-mocks-http');
const path = require('path');
const { containerClient } = require('../config/azureStorage');

describe('Event Controller', () => {
  test('getAllEvents returns event list with 200 status', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockEvents = [{ id: 1, title: 'Test Event', date: '2025-06-01' }];
    eventService.getAllEvents.mockResolvedValueOnce(mockEvents);

    await eventController.getAllEvents(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockEvents,
    });
    expect(res.statusCode).toBe(200);
    expect(eventService.getAllEvents).toHaveBeenCalled();
  });

  test('getEventByID returns an event with 200 status', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockEvent = { id: 1, title: 'Test Event', date: '2025-06-01' };
    eventService.getEventByID.mockResolvedValueOnce(mockEvent);

    await eventController.getEventByID(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockEvent,
    });
    expect(eventService.getEventByID).toHaveBeenCalledWith('1');
  });

  test('postNewEvent creates a new event with image upload', async () => {
    const req = httpMocks.createRequest({
      body: {
        title: 'New Event',
        description: 'Event description',
        timeslot: '10:00-11:00',
        facility_id: 2,
        date: '2025-07-01',
        host: 'Host Name',
      },
      file: {
        originalname: 'event_image.jpg',
        buffer: Buffer.from('image data'),
        mimetype: 'image/jpeg',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockEvent = { id: 2, title: 'New Event', status: 'Pending' };

    eventService.postNewEvent.mockResolvedValueOnce(mockEvent);
    const blockBlobClient = {
      uploadData: jest.fn().mockResolvedValueOnce(undefined),
      url: 'https://example.com/image.jpg',
    };
    containerClient.getBlockBlobClient = jest.fn().mockReturnValue(blockBlobClient);

    await eventController.postNewEvent(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockEvent,
    });
    expect(eventService.postNewEvent).toHaveBeenCalledWith(
      'New Event',
      'Event description',
      '10:00-11:00',
      2,
      '2025-07-01',
      'Host Name',
      'https://example.com/image.jpg'
    );
    expect(blockBlobClient.uploadData).toHaveBeenCalledWith(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });
  });

  test('postNewEvent handles error when no file is provided', async () => {
    const req = httpMocks.createRequest({
      body: {
        title: 'New Event',
        description: 'Event description',
        timeslot: '10:00-11:00',
        facility_id: 2,
        date: '2025-07-01',
        host: 'Host Name',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockEvent = { id: 2, title: 'New Event', status: 'Pending' };
    eventService.postNewEvent.mockResolvedValueOnce(mockEvent);

    await eventController.postNewEvent(req, res, next);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockEvent,
    });
    expect(eventService.postNewEvent).toHaveBeenCalledWith(
      'New Event',
      'Event description',
      '10:00-11:00',
      2,
      '2025-07-01',
      'Host Name',
      null
    );
  });

  test('getAllEvents handles errors', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockError = new Error('Something went wrong');
    eventService.getAllEvents.mockRejectedValueOnce(mockError);

    await eventController.getAllEvents(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('getEventByID handles errors', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockError = new Error('Event not found');
    eventService.getEventByID.mockRejectedValueOnce(mockError);

    await eventController.getEventByID(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('postNewEvent handles errors', async () => {
    const req = httpMocks.createRequest({
      body: {
        title: 'New Event',
        description: 'Event description',
        timeslot: '10:00-11:00',
        facility_id: 2,
        date: '2025-07-01',
        host: 'Host Name',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mockError = new Error('Failed to create event');
    eventService.postNewEvent.mockRejectedValueOnce(mockError);

    await eventController.postNewEvent(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
