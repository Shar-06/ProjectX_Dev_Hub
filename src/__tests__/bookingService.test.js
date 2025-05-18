jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

const data = require('../config/database');
const bookingService = require('../api/services/bookingService');

// getAllBookings returns all bookings
test('getAllBookings returns all bookings', async () => {
  const mockRows = [{ id: 1, facility_id: 101 }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await bookingService.getAllBookings();
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Booking" ORDER BY date, timeslot ASC');
});

// getBookingsByResidentId returns matching bookings
test('getBookingsByResidentId returns bookings for resident', async () => {
  const mockRows = [{ id: 1, resident_id: 7 }];
  data.query.mockResolvedValueOnce({ rows: mockRows });

  const result = await bookingService.getBookingsByResidentId(7);
  expect(result).toEqual(mockRows);
  expect(data.query).toHaveBeenCalledWith({
    text: 'SELECT * FROM "Booking" WHERE resident_id = $1 ORDER BY date, timeslot',
    values: [7],
  });
});

// getBookingByID returns a booking
test('getBookingByID returns booking if found', async () => {
  const mockBooking = { id: 1, date: '2025-05-01' };
  data.query.mockResolvedValueOnce({ rows: [mockBooking] });

  const result = await bookingService.getBookingByID(1);
  expect(result).toEqual(mockBooking);
  expect(data.query).toHaveBeenCalledWith({
    text: 'SELECT * FROM "Booking" WHERE id = $1',
    values: [1],
  });
});

// getBookingByID throws if not found
test('getBookingByID throws error if booking not found', async () => {
  data.query.mockResolvedValueOnce({ rows: [] });

  await expect(bookingService.getBookingByID(999)).rejects.toThrow('Booking not found');
});

// patchBookingStatus updates a booking
test('patchBookingStatus updates and returns booking', async () => {
  const updatedBooking = { id: 1, status: 'Approved' };
  data.query.mockResolvedValueOnce({ rowCount: 1, rows: [updatedBooking] });

  const result = await bookingService.patchBookingStatus(1, 'Approved');
  expect(result).toEqual(updatedBooking);
  expect(data.query).toHaveBeenCalledWith({
    text: 'UPDATE "Booking" SET status = $2 WHERE id = $1 RETURNING *',
    values: [1, 'Approved'],
  });
});

// patchBookingStatus throws if booking not found
test('patchBookingStatus throws error if booking not found', async () => {
  data.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

  await expect(bookingService.patchBookingStatus(999, 'Approved')).rejects.toThrow('Booking not found');
});

// postNewBooking inserts booking
test('postNewBooking inserts new booking', async () => {
  const newBooking = { id: 1, status: 'Pending' };
  data.query.mockResolvedValueOnce({ rows: [newBooking] });

  const result = await bookingService.postNewBooking('2025-06-01', 2, 3, '10:00-11:00');
  expect(result).toEqual(newBooking);
  expect(data.query).toHaveBeenCalledWith({
    text: 'INSERT INTO "Booking" (date, facility_id, resident_id, status, timeslot) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: ['2025-06-01', 2, 3, 'Pending', '10:00-11:00'],
  });
});

// postNewBooking throws duplicate error
test('postNewBooking returns error on duplicate', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress error log

  const duplicateError = new Error('duplicate key');
  duplicateError.code = '23505';
  data.query.mockRejectedValueOnce(duplicateError);

  await expect(
    bookingService.postNewBooking('2025-06-01', 2, 3, '10:00-11:00')
  ).rejects.toThrow('Booking ID already exists');

  console.error.mockRestore(); // restore original console.error
});

// postNewBooking throws generic database error
test('postNewBooking throws generic error on failure', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress error log

  const dbError = new Error('Something went wrong');
  data.query.mockRejectedValueOnce(dbError);

  await expect(
    bookingService.postNewBooking('2025-06-01', 2, 3, '10:00-11:00')
  ).rejects.toThrow('Failed to create booking');

  console.error.mockRestore(); // restore original console.error
});
