jest.mock('../api/services/notificationService', () => ({
  getAllNotifications: jest.fn(),
  getNotificationsByType: jest.fn(),
  getNotificationsById: jest.fn(),
  postNewNotification: jest.fn(),
}));

const httpMocks = require('node-mocks-http');
const notificationController = require('../api/controllers/notificationController');
const notificationService = require('../api/services/notificationService');

// getAllNotifications test
test('getAllNotifications returns notifications with 200 status', async () => {
  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockNotifications = [{ id: 1, message: 'Test message' }];
  notificationService.getAllNotifications.mockResolvedValueOnce(mockNotifications);

  await notificationController.getAllNotifications(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockNotifications,
  });
  expect(res.statusCode).toBe(200);
  expect(notificationService.getAllNotifications).toHaveBeenCalled();
});


// getNotificationsByType test
test('getNotificationsByType returns notifications by type', async () => {
  const req = httpMocks.createRequest({ params: { type: 'alert' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ id: 2, type: 'alert', message: 'Alert message' }];
  notificationService.getNotificationsByType.mockResolvedValueOnce(mockData);

  await notificationController.getNotificationsByType(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockData,
  });
  expect(notificationService.getNotificationsByType).toHaveBeenCalledWith('alert');
});


// getNotificationsById test
test('getNotificationsById returns notifications by user and type', async () => {
  const req = httpMocks.createRequest({ params: { userid: '1', type: 'reminder' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockData = [{ id: 3, userid: 1, type: 'reminder', message: 'Reminder message' }];
  notificationService.getNotificationsById.mockResolvedValueOnce(mockData);

  await notificationController.getNotificationsById(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockData,
  });
  expect(notificationService.getNotificationsById).toHaveBeenCalledWith('1', 'reminder');
});


// postNewNotification test
test('postNewNotification inserts notification and returns response', async () => {
  const req = httpMocks.createRequest({
    body: {
      date: '2025-05-19',
      timeslot: '10:00',
      status: 'sent',
      message: 'Hello there',
      userid: 1,
      type: 'update',
      username: 'johndoe'
    }
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockResult = [{ id: 4 }];
  notificationService.postNewNotification.mockResolvedValueOnce(mockResult);

  await notificationController.postNewNotification(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockResult,
  });
  expect(notificationService.postNewNotification).toHaveBeenCalledWith(
    '2025-05-19',
    '10:00',
    'sent',
    'Hello there',
    1,
    'update',
    'johndoe'
  );
});
