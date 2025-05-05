// ✅ Mocks must go first, before any imports that use them
jest.mock('../config/azureStorage.js', () => ({
    containerClient: {
      getBlockBlobClient: jest.fn(() => ({
        uploadData: jest.fn().mockResolvedValue(),
        url: 'https://fake.blob.core.windows.net/fakecontainer/image.png',
      })),
    },
  }));
  
  jest.mock('../api/services/eventService', () => ({
    getAllEvents: jest.fn(),
    getEventByID: jest.fn(),
    postNewEvent: jest.fn(),
  }));
  
  const eventController = require('../api/controllers/eventController');
  const eventService = require('../api/services/eventService');
  const httpMocks = require('node-mocks-http');
  const path = require('path');
  
  describe('Event Controller', () => {
  
    test('getAllEvents returns list with 200 status', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
  
      const mockEvents = [{ id: 1, title: 'Soccer Match' }];
      eventService.getAllEvents.mockResolvedValueOnce(mockEvents);
  
      await eventController.getAllEvents(req, res, next);
  
      expect(res._getJSONData()).toEqual({
        success: true,
        data: mockEvents,
      });
      expect(res.statusCode).toBe(200);
      expect(eventService.getAllEvents).toHaveBeenCalled();
    });
  
    test('getEventByID returns single event', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();
  
      const mockEvent = { id: 1, title: 'Basketball Game' };
      eventService.getEventByID.mockResolvedValueOnce(mockEvent);
  
      await eventController.getEventByID(req, res, next);
  
      expect(res._getJSONData()).toEqual({
        success: true,
        data: mockEvent,
      });
      expect(eventService.getEventByID).toHaveBeenCalledWith('1');
    });
  
    test('postNewEvent creates new event with image', async () => {
      const mockFile = {
        originalname: 'banner.png',
        mimetype: 'image/png',
        buffer: Buffer.from('fake'),
      };
  
      const req = httpMocks.createRequest({
        method: 'POST',
        file: mockFile,
        body: {
          id: '2',
          title: 'Yoga Session',
          description: 'Morning yoga for everyone',
          timeslot: '09:00-10:00',
          facility_id: 'A1',
          date: '2025-06-01',
          host: 'Alice',
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
  
      const mockEvent = {
        id: '2',
        title: 'Yoga Session',
        imageUrl: 'https://fake.blob.core.windows.net/fakecontainer/image.png',
      };
      eventService.postNewEvent.mockResolvedValueOnce(mockEvent);
  
      await eventController.postNewEvent(req, res, next);
  
      expect(res._getJSONData()).toEqual({
        success: true,
        data: mockEvent,
      });
  
      expect(eventService.postNewEvent).toHaveBeenCalledWith(
        '2',
        'Yoga Session',
        'Morning yoga for everyone',
        '09:00-10:00',
        'A1',
        '2025-06-01',
        'Alice',
        expect.stringContaining('https://fake.blob.core.windows.net/fakecontainer/')
      );
    });
  
  });
  