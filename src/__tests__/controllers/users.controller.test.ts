import { NextFunction, Request, Response } from 'express';
import { UsersController } from '@controllers/users.controller';
import { ICreateUser } from '@interfaces/users.interface';
import { UsersService } from '@/services/users.service';
import Container from 'typedi';
import { HttpExpection } from '@/exceptions/httpException';
jest.mock('../../services/users.service.ts');

// Create a mock instance of UsersService
const mockUsersService = new UsersService() as jest.Mocked<UsersService>;

// Define the behavior of the mock function

describe('Happy Paths', () => {
  let userController: UsersController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  const mockUser: ICreateUser = {
    user_name: 'test_user2',
    email: 'test_email2',
    password: 'pass',
    role: 'donor',
  };

  const serviceFuncResponse = {
    user_id: 9,
    user_name: 'test_user3',
    email: 'test_email3',
    password: 'pass',
    first_name: null,
    last_name: null,
    role: 'donor',
    contact_number: null,
    address: null,
    location_longitude: null,
    location_latitude: null,
  };

  mockUsersService.createUser.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));
  mockUsersService.findAllUsers.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));
  mockUsersService.getUser.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));
  mockUsersService.updateUser.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));

  beforeEach(() => {
    Container.set(UsersService, mockUsersService);
    userController = new UsersController();
    mockRequest = {
      body: mockUser,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    await userController.createUser(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User created successfully', data: [serviceFuncResponse] });
  });

  it('should be able to get all users successfully', async () => {
    mockRequest = {};
    await userController.getUsers(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'findAll', data: [serviceFuncResponse] });
  });

  it('should be able to get a user details by user_name successfully', async () => {
    mockRequest = {
      params: {
        user_name: 'test_user3',
      },
    };
    await userController.getUser(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User found', data: [serviceFuncResponse] });
  });

  it('Should be able to update a user by user_name successfully', async () => {
    mockRequest = {
      body: {
        role: 'donor',
      },
      params: {
        user_name: 'test_user3',
      },
    };
    await userController.updateUser(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User updated successfully', data: [serviceFuncResponse] });
  });
});

describe('Edge Cases', () => {
  let usersController: UsersController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });
  afterEach(async () => {
    jest.clearAllMocks();
  });
  it('Should return 404 if user is not found when getting a user by user_name', async () => {
    mockRequest = {
      params: {
        user_name: 'test_user3',
      },
    };
    mockUsersService.getUser.mockImplementation(async () => Promise.resolve([]));
    Container.set(UsersService, mockUsersService);
    usersController = new UsersController();
    await usersController.getUser(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('Should handle errors thrown by findAllUsers method', async () => {
    mockRequest = {};
    const error = new HttpExpection(500, 'Error occurred');
    mockUsersService.findAllUsers.mockImplementation(async () => Promise.reject(error));
    Container.set(UsersService, mockUsersService);
    usersController = new UsersController();
    await usersController.getUsers(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('Should handle errors thrown by createUser method when creating a user', async () => {
    mockRequest = {
      body: {
        user_name: 'test_user2',
        email: 'test_email2',
        password: '<PASSWORD>',
        role: 'donor',
      },
    };

    const error = new HttpExpection(500, 'Error occurred');
    mockUsersService.createUser.mockImplementation(async () => Promise.reject(error));
    Container.set(UsersService, mockUsersService);
    usersController = new UsersController();
    await usersController.createUser(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
  it('Should handle errors thrown by getUser method', async () => {
    mockRequest = {
      params: {
        user_name: 'test_user3',
      },
    };
    const error = new HttpExpection(500, 'Error occurred');
    mockUsersService.getUser.mockImplementation(async () => Promise.reject(error));
    Container.set(UsersService, mockUsersService);
    usersController = new UsersController();
    await usersController.getUser(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('Should handle errors thrown by updateUser method when creating a user', async () => {
    mockRequest = {
      params: {
        user_name: 'test_user3',
      },
      body: {
        password: '<PASSWORD>',
        role: 'donor',
      },
    };

    const error = new HttpExpection(500, 'Error occurred');
    mockUsersService.updateUser.mockImplementation(async () => Promise.reject(error));
    Container.set(UsersService, mockUsersService);
    usersController = new UsersController();
    await usersController.updateUser(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
