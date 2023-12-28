import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { FoodItemService } from '@/services/foodItem.service';
import { verify } from 'jsonwebtoken';
import { X_API_KEY } from '@/config';
import { getAuthorization } from '@/middlewares/auth.middleware';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { createFoodItemSchema, updateFoodItemSchema } from '@/utils/schemas';

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
      res.status(200).json({ message: 'findAll', count: foodItems.length, data: foodItems });
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
      const { role, id } = (await verify(token, X_API_KEY)) as DataStoredInToken;
      if (role === 'recipient') {
        res.status(403).json({ message: 'Recipient is not allowed to access this resource' });
        return;
      }

      const { error, value } = createFoodItemSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: 'Invalid request body', error: error.details });
        return;
      }
      const foodItem = await this.foodItems.createFoodItem(value, id);
      res.status(200).json({ message: 'Food Item created successfully', data: foodItem });
      return;
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
      const food_item_id: number = parseInt(req.params.food_item_id, 10);
      if (food_item_id) {
        const { error, value } = updateFoodItemSchema.validate(req.body);
        if (error) {
          res.status(400).json({ message: 'Invalid request body', error: error.details });
          return;
        }
        const foodItem = await this.foodItems.updateFoodItem(value, food_item_id);
        if (foodItem.length === 0) {
          res.status(404).json({ message: 'Food Item not found' });
          return;
        }
        res.status(200).json({ message: 'Food Item updated successfully', data: foodItem });
        return;
      }
      next(new Error('food_item_id not provided'));
    } catch (error) {
      next(error);
    }
  };
}
