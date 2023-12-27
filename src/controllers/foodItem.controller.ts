import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { FoodItemService } from '@/services/foodItem.service';
import { ICreateFoodItem, IUpdateFoodItem } from '@/interfaces/foodItem.interface';
import { Verify } from 'jsonwebtoken';
import { X_API_KEY } from '@/config';
import { getAuthorization } from '@/middlewares/auth.middleware';
import { DataStoredInToken } from '@/interfaces/auth.interface';

/**
 * Controller class for managing food items.
 */
export class FoodItemsController {
  /**
   * Instance of the FoodItemService class.
   */
  public foodItems = Container.get(FoodItemService);

  /**
   * Retrieves all food items.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public getFoodItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const foodItems = await this.foodItems.findAllFoodItems();
      res.status(200).json({ message: 'findAll', data: foodItems });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new food item.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public createFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = getAuthorization(req);
      const { role } = (await Verify(token, X_API_KEY)) as DataStoredInToken;
      if (role === 'donor') res.status(403).json({ message: 'Donor is not allowed to access this resource ' });
      const reqBody: ICreateFoodItem = req.body;
      const foodItem = await this.foodItems.createFoodItem(reqBody);
      res.status(200).json({ message: 'Food Item created successfully', data: foodItem });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates an existing food item.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public updateFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const food_item_id: number = req.params.food_item_id;
      if (food_item_id) {
        const reqBody: IUpdateFoodItem = req.body;
        const foodItem = await this.foodItems.updateFoodItem(reqBody, food_item_id);
        if (foodItem.length === 0) {
          res.status(404).json({ message: 'Food Item not found' });
          return;
        }
        res.status(200).json({ message: 'Food Item updated successfully', data: foodItem });
      }
      next(new Error('food_item_id not provided'));
    } catch (error) {
      next(error);
    }
  };
}
