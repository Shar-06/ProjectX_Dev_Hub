jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const notificationService = require('../api/services/notificationService');


// getAllNotifications returns all notifications
test('getAllNotifications returns all notifications', async () => {
  const mockRows = [{ id: 1, message: 'Hello' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await notificationService.getAllNotifications();
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Notification" ORDER BY id ASC');
});


// getNotificationsByType returns matching notifications
test('getNotificationsByType returns notifications by type', async () => {
  const mockRows = [{ id: 2, type: 'alert' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await notificationService.getNotificationsByType('alert');
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith({
    text: 'SELECT * FROM "Notification" WHERE type = $1',
    values: ['alert'],
  });
});


// getNotificationsByType throws error if none found
test('getNotificationsByType throws error if not found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  await expect(notificationService.getNotificationsByType('missing')).rejects.toThrow('Notification records not found');
});


// getNotificationsById returns notifications by user and type
test('getNotificationsById returns matching notifications', async () => {
  const mockRows = [{ id: 3, userid: 1, type: 'reminder' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await notificationService.getNotificationsById(1, 'reminder');
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith({
    text: 'SELECT * FROM "Notification" WHERE userid = $1 AND type = $2',
    values: [1, 'reminder'],
  });
});


// getNotificationsById throws error if none found
test('getNotificationsById throws error if not found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  await expect(notificationService.getNotificationsById(99, 'none')).rejects.toThrow('Notification records not found');
});


// postNewNotification inserts and returns result
test('postNewNotification inserts new notification', async () => {
  const mockRows = [{ id: 4 }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await notificationService.postNewNotification('2025-05-19', '10:00', 'sent', 'msg', 1, 'reminder', 'john');
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith({
    text: 'INSERT INTO "Notification" (date, timeslot, status, message, userid, type, username) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    values: ['2025-05-19', '10:00', 'sent', 'msg', 1, 'reminder', 'john'],
  });
});


// postNewNotification throws error on failure
test('postNewNotification throws error if query fails', async () => {
  data.query.mockRejectedValueOnce(new Error('DB fail'));

  await expect(
    notificationService.postNewNotification('2025-05-19', '10:00', 'sent', 'msg', 1, 'reminder', 'john')
  ).rejects.toThrow('Error inserting notification: DB fail');
});
