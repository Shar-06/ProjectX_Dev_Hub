jest.mock('../config/database', () => ({
    query: jest.fn(),
  }));
  
  const data = require('../config/database');
  const bookingService = require('../api/services/bookingService');
  
  // Get all bookings
  test('getAllBookings returns all bookings', async () => {
    const mockRows = [{ id: 1, status: 'pending' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await bookingService.getAllBookings();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "Booking" ORDER BY id ASC');
  });
  
  // Get booking by ID
  test('getBookingByID returns booking if found', async () => {
    const mockBooking = { id: 1, status: 'confirmed' };
    data.query.mockResolvedValueOnce({ rows: [mockBooking] });
  
    const result = await bookingService.getBookingByID(1);
    expect(result).toEqual(mockBooking);
  });
  
  // Get booking by ID – not found
  test('getBookingByID throws error if booking not found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(bookingService.getBookingByID(999)).rejects.toThrow('User not found');
  });
  
  // Update booking status
  test('patchBookingStatus updates and returns booking', async () => {
    const updatedBooking = { id: 1, status: 'approved' };
    data.query.mockResolvedValueOnce({ rowCount: 1, rows: [updatedBooking] });
  
    const result = await bookingService.patchBookingStatus(1, 'approved');
    expect(result).toEqual(updatedBooking);
  });
  
  // Update booking status – not found
  test('patchBookingStatus throws error if booking not found', async () => {
    data.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
  
    await expect(bookingService.patchBookingStatus(1, 'approved')).rejects.toThrow('Booking not found');
  });
  
  // Create new booking
  test('postNewBooking inserts new booking', async () => {
    const mockRows = [{ id: 1 }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    // Add missing time logic for this call to match service method
    const id = 1;
    const start_time = '10:00';
    const end_time = '11:00';
    const status = 'pending';
    const date = '2025-05-05';
    const facility_id = 2;
    const resident_id = 3;
  
    // Temporarily patch the method to include `time` construction
    const time = `${start_time} - ${end_time}`;
    const query = {
      text: 'INSERT INTO "Booking" (id,status,date,facility_id,resident_id,timeslot) VALUES ($1,$2,$3,$4,$5,$6)',
      values: [id, status, date, facility_id, resident_id, time]
    };
  
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await bookingService.postNewBooking(id, start_time, end_time, status, date, facility_id, resident_id);
    expect(result).toEqual(mockRows);
  });
  
  // Duplicate booking
  test('postNewBooking returns error on duplicate', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = '23505';
    data.query.mockRejectedValueOnce(duplicateError);
  
    const result = await bookingService.postNewBooking(
      1, '10:00', '11:00', 'pending', '2025-05-05', 2, 3
    );
    expect(result).toEqual({ error: 'Booking already exists.' });
  });
  