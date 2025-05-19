jest.mock('../api/services/eventService', () => ({
  getAllEvents: jest.fn(),
  getEventByID: jest.fn(),
  postNewEvent: jest.fn(),
}));

const eventController = require('../api/controllers/eventController');
const eventService = require('../api/services/eventService');
const httpMocks = require('node-mocks-http');
const { containerClient } = require('../config/azureStorage');

describe('Event Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('getAllEvents', () => {
    test('should return 200 and all events', async () => {
      const mockEvents = [{ id: 1, title: 'Test Event', date: '2025-06-01' }];
      eventService.getAllEvents.mockResolvedValueOnce(mockEvents);

      await eventController.getAllEvents(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ success: true, data: mockEvents });
      expect(eventService.getAllEvents).toHaveBeenCalled();
    });

    test('should call next with error on failure', async () => {
      const error = new Error('Failed to fetch');
      eventService.getAllEvents.mockRejectedValueOnce(error);

      await eventController.getAllEvents(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getEventByID', () => {
    test('should return 200 and the event', async () => {
      const mockEvent = { id: 1, title: 'Test Event', date: '2025-06-01' };
      req.params.id = '1';
      eventService.getEventByID.mockResolvedValueOnce(mockEvent);

      await eventController.getEventByID(req, res, next);

      expect(res._getJSONData()).toEqual({ success: true, data: mockEvent });
      expect(eventService.getEventByID).toHaveBeenCalledWith('1');
    });

    test('should call next with error on failure', async () => {
      const error = new Error('Event not found');
      req.params.id = '1';
      eventService.getEventByID.mockRejectedValueOnce(error);

      await eventController.getEventByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('postNewEvent', () => {
    beforeEach(() => {
      req.body = {
        title: 'New Event',
        description: 'Event description',
        timeslot: '10:00-11:00',
        facility_id: 2,
        date: '2025-07-01',
        host: 'Host Name',
      };
    });

    test('should upload image and create event with image URL', async () => {
      req.file = {
        originalname: 'event_image.jpg',
        buffer: Buffer.from('image data'),
        mimetype: 'image/jpeg',
      };

      const mockEvent = { id: 2, title: 'New Event', status: 'Pending' };

      const mockBlobClient = {
        uploadData: jest.fn().mockResolvedValueOnce(undefined),
        url: 'https://example.com/image.jpg',
      };

      containerClient.getBlockBlobClient = jest.fn().mockReturnValue(mockBlobClient);
      eventService.postNewEvent.mockResolvedValueOnce(mockEvent);

      await eventController.postNewEvent(req, res, next);

      expect(mockBlobClient.uploadData).toHaveBeenCalledWith(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });
      expect(eventService.postNewEvent).toHaveBeenCalledWith(
        'New Event', 'Event description', '10:00-11:00', 2, '2025-07-01', 'Host Name', 'https://example.com/image.jpg'
      );
      expect(res._getJSONData()).toEqual({ success: true, data: mockEvent });
    });

    test('should create event with null imageURL if no file is uploaded', async () => {
      const mockEvent = { id: 2, title: 'New Event', status: 'Pending' };
      eventService.postNewEvent.mockResolvedValueOnce(mockEvent);

      await eventController.postNewEvent(req, res, next);

      expect(eventService.postNewEvent).toHaveBeenCalledWith(
        'New Event', 'Event description', '10:00-11:00', 2, '2025-07-01', 'Host Name', null
      );
      expect(res._getJSONData()).toEqual({ success: true, data: mockEvent });
    });

    test('should call next with error on failure', async () => {
      const error = new Error('Failed to create event');
      eventService.postNewEvent.mockRejectedValueOnce(error);

      await eventController.postNewEvent(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
