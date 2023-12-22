import { Router } from 'express';
import { IRoutes } from '@interfaces/routes.interface';
import { FoodItemsController } from '@/controllers/foodItem.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class FoodItemsRoute implements IRoutes {
  public path = '/foodItems';
  public router = Router();
  public foodItems = new FoodItemsController();
  constructor() {
    this.initializeRoutes();
  }
  /**
   ** Initializes the routes for the food items API.
   ** Registers route handlers for GET, POST, PUT requests.
   */
  private initializeRoutes() {
    this.router.use(this.path, AuthMiddleware);
    this.router.get(this.path, this.foodItems.getFoodItems);
    this.router.post(`${this.path}/create`, this.foodItems.createFoodItem);
    this.router.put(`${this.path}/update/:food_item_id`, this.foodItems.updateFoodItem);
  }
}
