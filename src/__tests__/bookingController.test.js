jest.mock('../api/services/bookingService', () => ({
  getAllBookings: jest.fn(),
  getBookingsByResidentId: jest.fn(),
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

  const mockBookings = [{ id: 1, facility: 'Hall A' }];
  bookingService.getAllBookings.mockResolvedValueOnce(mockBookings);

  await bookingController.getAllBookings(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockBookings,
  });
  expect(res.statusCode).toBe(200);
  expect(bookingService.getAllBookings).toHaveBeenCalled();
});

test('getBookingsByResidentId returns bookings for resident', async () => {
  const req = httpMocks.createRequest({ params: { residentId: '42' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockBookings = [{ id: 1, residentId: 42 }];
  bookingService.getBookingsByResidentId.mockResolvedValueOnce(mockBookings);

  await bookingController.getBookingsByResidentId(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockBookings,
  });
  expect(bookingService.getBookingsByResidentId).toHaveBeenCalledWith('42');
});

test('getBookingByID returns a booking', async () => {
  const req = httpMocks.createRequest({ params: { id: '10' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockBooking = { id: 10, facility: 'Court 1' };
  bookingService.getBookingByID.mockResolvedValueOnce(mockBooking);

  await bookingController.getBookingByID(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockBooking,
  });
  expect(bookingService.getBookingByID).toHaveBeenCalledWith('10');
});

test('patchBookingStatus updates booking status', async () => {
  const req = httpMocks.createRequest({ params: { id: '5', status: 'approved' } });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockUpdatedBooking = { id: 5, status: 'approved' };
  bookingService.patchBookingStatus.mockResolvedValueOnce(mockUpdatedBooking);

  await bookingController.patchBookingStatus(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockUpdatedBooking,
  });
  expect(bookingService.patchBookingStatus).toHaveBeenCalledWith('5', 'approved');
});

test('postNewBooking inserts booking and returns response', async () => {
  const req = httpMocks.createRequest({
    body: {
      date: '2025-05-20',
      facility_id: 3,
      resident_id: 7,
      timeslot: '10:00-11:00',
    },
  });
  const res = httpMocks.createResponse();
  const next = jest.fn();

  const mockBooking = {
    id: 101,
    date: '2025-05-20',
    facility_id: 3,
    resident_id: 7,
    timeslot: '10:00-11:00',
  };
  bookingService.postNewBooking.mockResolvedValueOnce(mockBooking);

  await bookingController.postNewBooking(req, res, next);

  expect(res._getJSONData()).toEqual({
    success: true,
    data: mockBooking,
  });
  expect(bookingService.postNewBooking).toHaveBeenCalledWith(
    '2025-05-20',
    3,
    7,
    '10:00-11:00'
  );
});

test('postNewBooking returns 400 if required fields are missing', async () => {
  const req = httpMocks.createRequest({ body: { date: '2025-05-20' } }); // Missing other fields
  const res = httpMocks.createResponse();
  const next = jest.fn();

  await bookingController.postNewBooking(req, res, next);

  expect(res.statusCode).toBe(400);
  expect(res._getJSONData()).toEqual({
    success: false,
    message: 'Missing required booking fields',
  });
});
