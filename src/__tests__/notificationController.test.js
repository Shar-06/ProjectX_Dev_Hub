jest.mock('../api/services/notificationService', () => ({
    getAllNotifications: jest.fn(),
    getNotificationsByType: jest.fn(),
    getNotificationsById: jest.fn(),
    postNewNotification: jest.fn(),
  }));
  
  const notificationController = require('../api/controllers/notificationController');
  const notificationService = require('../api/services/notificationService');
  const httpMocks = require('node-mocks-http');
  
  test('getAllNotifications returns notification list with 200 status', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockNotifications = [{ id: 1, message: 'Hello' }];
    notificationService.getAllNotifications.mockResolvedValueOnce(mockNotifications);
  
    await notificationController.getAllNotifications(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockNotifications,
    });
    expect(res.statusCode).toBe(200);
    expect(notificationService.getAllNotifications).toHaveBeenCalled();
  });
  
  test('getNotificationsByType returns notifications of a specific type', async () => {
    const req = httpMocks.createRequest({ params: { type: 'info' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockNotifications = [{ id: 2, type: 'info', message: 'Type-based message' }];
    notificationService.getNotificationsByType.mockResolvedValueOnce(mockNotifications);
  
    await notificationController.getNotificationsByType(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockNotifications,
    });
    expect(notificationService.getNotificationsByType).toHaveBeenCalledWith('info');
  });
  
  test('getNotificationsById returns user-specific notifications', async () => {
    const req = httpMocks.createRequest({ params: { userid: '123', type: 'warning' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockNotifications = [{ id: 3, userid: '123', type: 'warning', message: 'User warning' }];
    notificationService.getNotificationsById.mockResolvedValueOnce(mockNotifications);
  
    await notificationController.getNotificationsById(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockNotifications,
    });
    expect(notificationService.getNotificationsById).toHaveBeenCalledWith('123', 'warning');
  });
  
  test('postNewNotification inserts a notification and returns response', async () => {
    const req = httpMocks.createRequest({
      body: {
        date: '2025-05-05',
        timeslot: '12:00',
        status: 'unread',
        message: 'New notification',
        userid: '123',
        type: 'info',
        username: 'John',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockNotification = {
      id: 4,
      date: '2025-05-05',
      timeslot: '12:00',
      status: 'unread',
      message: 'New notification',
      userid: '123',
      type: 'info',
      username: 'John',
    };
    notificationService.postNewNotification.mockResolvedValueOnce(mockNotification);
  
    await notificationController.postNewNotification(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockNotification,
    });
    expect(notificationService.postNewNotification).toHaveBeenCalledWith(
      '2025-05-05',
      '12:00',
      'unread',
      'New notification',
      '123',
      'info',
      'John'
    );
  });
  