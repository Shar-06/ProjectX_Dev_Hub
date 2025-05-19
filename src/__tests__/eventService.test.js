jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const eventService = require('../api/services/eventService');

describe('Event Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvents', () => {
    test('should return all events from the database', async () => {
      const mockRows = [{ id: 1, title: 'Event 1' }];
      data.query.mockResolvedValueOnce({ rows: mockRows });

      const result = await eventService.getAllEvents();

      expect(result).toEqual(mockRows);
      expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Event" ORDER BY id ASC');
    });
  });

  describe('postNewEvent', () => {
    const mockEventData = [
      'New Event', 'desc', '10:00', 1, '2025-05-19', 'host', 'url'
    ];

    test('should insert a new event and return it', async () => {
      const mockRows = [{ id: 1, title: 'New Event' }];
      data.query.mockResolvedValueOnce({ rows: mockRows });

      const result = await eventService.postNewEvent(...mockEventData);

      expect(result).toEqual(mockRows);
      expect(data.query).toHaveBeenCalledWith({
        text: 'INSERT INTO "Event" (title,description,timeslot,facility_id,date,host,imageURL) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        values: mockEventData,
      });
    });

    test('should return a user-friendly error on duplicate insert', async () => {
      const duplicateError = new Error('duplicate key');
      duplicateError.code = '23505';
      data.query.mockRejectedValueOnce(duplicateError);

      const result = await eventService.postNewEvent(...mockEventData);

      expect(result).toEqual({ error: 'Event already exists.' });
    });

    test('should throw unknown errors', async () => {
      const unknownError = new Error('DB connection failed');
      data.query.mockRejectedValueOnce(unknownError);

      await expect(eventService.postNewEvent(...mockEventData)).rejects.toThrow('DB connection failed');
    });
  });
});
