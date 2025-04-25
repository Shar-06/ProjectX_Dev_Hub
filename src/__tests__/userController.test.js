jest.mock('../api/services/userService', () => ({
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByName: jest.fn(),
    patchUserRole: jest.fn(),
    postNewUser: jest.fn(),
  }));
  
  const userController = require('../api/controllers/userController');
  const userService = require('../api/services/userService');
  
  const httpMocks = require('node-mocks-http');


  test('getAllUsers returns user list with 200 status', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUsers = [{ id: 1, name: 'Alice' }];
    userService.getAllUsers.mockResolvedValueOnce(mockUsers);
  
    await userController.getAllUsers(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUsers,
    });
    expect(res.statusCode).toBe(200);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  test('getUserById returns a user', async () => {
    const req = httpMocks.createRequest({ params: { id: '1' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUser = { id: 1, name: 'Bob' };
    userService.getUserById.mockResolvedValueOnce(mockUser);
  
    await userController.getUserById(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUser,
    });
    expect(userService.getUserById).toHaveBeenCalledWith('1');
  });
  
  test('patchUserRole updates user role', async () => {
    const req = httpMocks.createRequest({ params: { id: '1', role: 'admin' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUpdatedUser = { id: 1, role: 'admin' };
    userService.patchUserRole.mockResolvedValueOnce(mockUpdatedUser);
  
    await userController.patchUserRole(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUpdatedUser,
    });
    expect(userService.patchUserRole).toHaveBeenCalledWith('1', 'admin');
  });


  test('postNewUser inserts user and returns response', async () => {
    const req = httpMocks.createRequest({
      body: { uid: 'abc', email: 'user@example.com', displayName: 'Test User' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
  
    const mockUser = { id: 'abc', email: 'user@example.com', name: 'Test User' };
    userService.postNewUser.mockResolvedValueOnce(mockUser);
  
    await userController.postNewUser(req, res, next);
  
    expect(res._getJSONData()).toEqual({
      success: true,
      data: mockUser,
    });
    expect(userService.postNewUser).toHaveBeenCalledWith('abc', 'user@example.com', 'Test User');
  });
  
  

  

