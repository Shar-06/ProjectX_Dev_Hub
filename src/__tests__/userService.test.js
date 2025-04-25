jest.mock('../config/database', () => ({
    query: jest.fn(),
  }));
  
  const data = require('../config/database');
  const userService = require('../api/services/userService');
  

  //get all users
  test('getAllUsers returns all users', async () => {
    const mockRows = [{ id: 1, name: 'Sharlene' }];
    data.query.mockResolvedValueOnce({ rows: mockRows });
  
    const result = await userService.getAllUsers();
    expect(result).toEqual(mockRows);
    expect(data.query).toHaveBeenCalledWith('SELECT * FROM "User" ORDER BY id ASC');
  });
  
//user does not exist
  test('getUserById returns user if found', async () => {
    const mockUser = { id: 1, name: 'Themba' };
    data.query.mockResolvedValueOnce({ rows: [mockUser] });
  
    const result = await userService.getUserById(1);
    expect(result).toEqual(mockUser);
  });
  

  //what happens when user is not found
  test('getUserById throws error if not found', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    await expect(userService.getUserById(999)).rejects.toThrow('User not found');
  });
  
  //update user actually updates 
  test('patchUserRole updates and returns user', async () => {
    const mockUpdated = { id: 1, role: 'admin' };
    data.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUpdated] });
  
    const result = await userService.patchUserRole(1, 'admin');
    expect(result).toEqual(mockUpdated);
  });
  

  //trying to update user that does not exist
  test('patchUserRole throws error if user not found', async () => {
    data.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
  
    await expect(userService.patchUserRole(1, 'admin')).rejects.toThrow('User not found');
  });
  

  //create new user actually works
  test('postNewUser inserts new user', async () => {
    data.query.mockResolvedValueOnce({ rows: [] });
  
    const result = await userService.postNewUser('123', 'test@mail.com', 'Test');
    expect(result).toEqual([]);
  });
  
  test('postNewUser returns error on duplicate', async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = '23505';
    data.query.mockRejectedValueOnce(duplicateError);
  
    const result = await userService.postNewUser('123', 'test@mail.com', 'Test');
    expect(result).toEqual({ error: 'User already registered.' });
  });
  
