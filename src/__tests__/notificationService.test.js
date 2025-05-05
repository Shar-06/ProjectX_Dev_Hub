jest.mock('../config/database', () => ({
    query: jest.fn(),
  }));
  
  const data = require('../config/database');
  const notificationService = require('../api/services/notificationService');
  
  // Get all notifications
  test('getAllNotifications returns all notifications', async () => {
    const mockRows = [{ id: 1, message: 'Reminder' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await notificationService.getAllNotifications();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM notification ORDER BY id ASC');
  });
  
  // Get notifications by type
  test('getNotificationsByType returns notifications if found', async () => {
    const mockRows = [{ id: 1, type: 'info' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await notificationService.getNotificationsByType('info');
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM notification WHERE type = $1',
      values: ['info']
    });
  });
  
  test('getNotificationsByType throws error if none found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(notificationService.getNotificationsByType('warning')).rejects.toThrow('Notification records not found');
  });
  
  // Get notifications by user ID and type
  test('getNotificationsById returns notifications if found', async () => {
    const mockRows = [{ id: 1, userid: 2, type: 'info' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await notificationService.getNotificationsById(2, 'info');
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM notification WHERE userid = $1 AND type = $2',
      values: [2, 'info']
    });
  });
  
  test('getNotificationsById throws error if none found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(notificationService.getNotificationsById(2, 'error')).rejects.toThrow('Notification records not found');
  });
  
  // Post new notification
  test('postNewNotification inserts new notification', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    const result = await notificationService.postNewNotification('2025-05-05', '10:00', 'pending', 'Meeting at 10', 1, 'reminder', 'John');
    expect(result).toEqual([]);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO notification (date, timeslot, status, message, userid, type, username) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      values: ['2025-05-05', '10:00', 'pending', 'Meeting at 10', 1, 'reminder', 'John']
    });
  });
  
  test('postNewNotification throws error on insert failure', async () => {
    data.query.mockRejectedValueOnce(new Error('DB error'));
  
    await expect(
      notificationService.postNewNotification('2025-05-05', '10:00', 'pending', 'Alert', 1, 'alert', 'Admin')
    ).rejects.toThrow('Error inserting notification: DB error');
  });
  