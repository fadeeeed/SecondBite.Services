import { NextFunction, Request, Response } from 'express';
import { FoodItemsController } from '@/controllers/foodItem.controller';
import { FoodItemService } from '@/services/foodItem.service';
import Container from 'typedi';
import { HttpExpection } from '@/exceptions/httpException';
import { ICreateFoodItem } from '@/interfaces/foodItem.interface';
jest.mock('../../services/foodItem.service.ts');

// Create a mock instance of UsersService
const mockFoodItemsService = new FoodItemService() as jest.Mocked<FoodItemService>;

// Define the behavior of the mock function

describe('Happy Paths', () => {
  let foodItemController: FoodItemsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  const mockUser: ICreateFoodItem = {
    name: 'Salad',
    description: 'Healthy yet Tasty Salad',
    quantity: 2,
    expiry_date: new Date('2023-12-12'),
    dietary_restrictions: 'N/A',
    image_url: 'N/A',
    donor_id: 2,
  };

  const serviceFuncResponse = {
    food_item_id: 4,
    name: 'Salad',
    description: 'Healthy yet Tasty Salad',
    quantity: 2,
    expiry_date: new Date('2023-12-11T18:30:00.000Z'),
    dietary_restrictions: 'N/A',
    image_url: 'N/A',
    donor_id: 2,
  };

  mockFoodItemsService.createFoodItem.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));
  mockFoodItemsService.findAllFoodItems.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));
  mockFoodItemsService.updateFoodItem.mockImplementation(async () => Promise.resolve([serviceFuncResponse]));

  beforeEach(() => {
    Container.set(FoodItemService, mockFoodItemsService);
    foodItemController = new FoodItemsController();
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

  it('should create a foodItem successfully', async () => {
    await foodItemController.createFoodItem(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Food Item created successfully', data: [serviceFuncResponse] });
  });

  it('should be able to get all foodItems successfully', async () => {
    mockRequest = {};
    await foodItemController.getFoodItems(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'findAll', data: [serviceFuncResponse] });
  });

  it('Should be able to update a foodItem by food_item_id successfully', async () => {
    mockRequest = {
      body: {
        role: 'donor',
      },
      params: {
        user_name: 'test_user3',
      },
    };
    await foodItemController.updateFoodItem(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Food Item updated successfully', data: [serviceFuncResponse] });
  });
});

describe('Edge Cases', () => {
  let foodItemController: FoodItemsController;
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

  it('Should handle errors thrown by findAllFoodItems method', async () => {
    mockRequest = {};
    const error = new HttpExpection(500, 'Error occurred');
    mockFoodItemsService.findAllFoodItems.mockImplementation(async () => Promise.reject(error));
    Container.set(FoodItemService, mockFoodItemsService);
    foodItemController = new FoodItemsController();
    await foodItemController.getFoodItems(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('Should handle errors thrown by createFoodItem method when creating a user', async () => {
    mockRequest = {
      body: {
        user_name: 'test_user2',
        email: 'test_email2',
        password: '<PASSWORD>',
        role: 'donor',
      },
    };

    const error = new HttpExpection(500, 'Error occurred');
    mockFoodItemsService.createFoodItem.mockImplementation(async () => Promise.reject(error));
    Container.set(FoodItemService, mockFoodItemsService);
    foodItemController = new FoodItemsController();
    await foodItemController.createFoodItem(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('Should handle errors thrown by updateFoodItem method when creating a user', async () => {
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
    mockFoodItemsService.updateFoodItem.mockImplementation(async () => Promise.reject(error));
    Container.set(FoodItemService, mockFoodItemsService);
    foodItemController = new FoodItemsController();
    await foodItemController.updateFoodItem(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
