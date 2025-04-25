jest.mock('../api/services/bookingService.js', () => ({
    getAllBookings: jest.fn(),
    getBookingByID: jest.fn(),
    patchBookingStatus: jest.fn(),
    postNewBooking: jest.fn(),
  }));
  
  const bookingController = require('../api/controllers/bookingController');
  const bookingService = require('../api/services/bookingService');
  const httpMocks = require('node-mocks-http');
  
  test('getAllBookings returns booking list with 200 status', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockBookings = [{ id: 1, date: '2025-05-01' }];
    bookingService.getAllBookings.mockResolvedValueOnce(mockBookings);
  
    await bookingController.getAllBookings(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockBookings,
    });
    expect(res.statusCode).toBe(200);
    expect(bookingService.getAllBookings).toHaveBeenCalled();
  });
  
  test('getBookingByID returns a booking', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockBooking = { id: 1, status: 'pending' };
    bookingService.getBookingByID.mockResolvedValueOnce(mockBooking);
  
    await bookingController.getBookingByID(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockBooking,
    });
    expect(bookingService.getBookingByID).toHaveBeenCalledWith('1');
  });
  
  test('patchBookingStatus updates booking status', async () => {
    const req = httpMocks.createRequest({ params: { id: '1', status: 'confirmed' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUpdatedBooking = { id: 1, status: 'confirmed' };
    bookingService.patchBookingStatus.mockResolvedValueOnce(mockUpdatedBooking);
  
    await bookingController.patchBookingStatus(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUpdatedBooking,
    });
    expect(bookingService.patchBookingStatus).toHaveBeenCalledWith('1', 'confirmed');
  });
  
  test('postNewBooking creates a booking and returns it', async () => {
    const req = httpMocks.createRequest({
      body: {
        id: 2,
        start_time: '08:00',
        end_time: '09:00',
        status: 'pending',
        date: '2025-06-01',
        facility_id: 5,
        resident_id: 10,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockBooking = { ...req.body };
    bookingService.postNewBooking.mockResolvedValueOnce(mockBooking);
  
    await bookingController.postNewBooking(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockBooking,
    });
    expect(bookingService.postNewBooking).toHaveBeenCalledWith(
      2, '08:00', '09:00', 'pending', '2025-06-01', 5, 10
    );
  });
  