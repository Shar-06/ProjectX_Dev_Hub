jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const eventService = require('../api/services/eventService');

// Test: getAllEvents returns all events
test('getAllEvents returns all events', async () => {
  const mockRows = [{ id: 1, title: 'Test Event', date: '2025-06-01' }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await eventService.getAllEvents();
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Event" ORDER BY id ASC');
});


// Test: postNewEvent inserts a new event
test('postNewEvent inserts a new event', async () => {
  const mockRows = [{ id: 1, title: 'New Event', date: '2025-07-01' }];
  const query = {
    text: 'INSERT INTO "Event" (title,description,timeslot,facility_id,date,host,imageURL) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    values: ['New Event', 'Event description', '10:00-11:00', 1, '2025-07-01', 'Host Name', null],
  };

  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await eventService.postNewEvent(
    'New Event',
    'Event description',
    '10:00-11:00',
    1,
    '2025-07-01',
    'Host Name',
    null
  );
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith(query);
});

// Test: postNewEvent returns error on duplicate entry
test('postNewEvent returns error on duplicate entry', async () => {
  const duplicateError = new Error('duplicate key');
  duplicateError.code = '23505';
  data.query.mockRejectedValueOnce(duplicateError);

  const result = await eventService.postNewEvent(
    'New Event',
    'Event description',
    '10:00-11:00',
    1,
    '2025-07-01',
    'Host Name',
    null
  );
  expect(result).toEqual({ error: 'Event already exists.' });
});

// Test: postNewEvent throws an error on unexpected DB failure
test('postNewEvent throws an error on database failure', async () => {
  const mockError = new Error('Something broke');
  data.query.mockRejectedValueOnce(mockError);

  await expect(
    eventService.postNewEvent(
      'New Event',
      'Event description',
      '10:00-11:00',
      1,
      '2025-07-01',
      'Host Name',
      null
    )
  ).rejects.toThrow('Something broke');
});
