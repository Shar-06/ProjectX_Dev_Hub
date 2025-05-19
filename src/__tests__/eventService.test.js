jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const eventService = require('../api/services/eventService');

describe('eventService', () => {

  test('getAllEvents returns all events', async () => {
    const mockRows = [{ id: 1, title: 'Event 1' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await eventService.getAllEvents();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Event" ORDER BY id ASC');
  });

  test('postNewEvent inserts new event', async () => {
    const mockRows = [{ id: 1, title: 'New Event' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await eventService.postNewEvent('New Event', 'desc', '10:00', 1, '2025-05-19', 'host', 'url');
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith({
      text: 'INSERT INTO "Event" (title,description,timeslot,facility_id,date,host,imageURL) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      values: ['New Event', 'desc', '10:00', 1, '2025-05-19', 'host', 'url'],
    });
  });

  test('postNewEvent returns error on duplicate', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = '23505';
    data.query.mockRejectedValueOnce(duplicateError);

    const result = await eventService.postNewEvent('Duplicate', 'desc', '10:00', 1, '2025-05-19', 'host', 'url');
    expect(result).toEqual({ error: 'Event already exists.' });
  });

  test('postNewEvent throws unknown error', async () => {
    const unknownError = new Error('connection lost');
    data.query.mockRejectedValueOnce(unknownError);

    await expect(
      eventService.postNewEvent('Fail Event', 'desc', '10:00', 1, '2025-05-19', 'host', 'url')
    ).rejects.toThrow('connection lost');
  });

});
