import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { FoodItemService } from '@/services/foodItem.service';
import { ICreateFoodItem, IUpdateFoodItem } from '@/interfaces/foodItem.interface';

export class FoodItemsController {
  public foodItems = Container.get(FoodItemService);

  public getFoodItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const foodItems = await this.foodItems.findAllFoodItems();
      res.status(200).json({ message: 'findAll', data: foodItems });
    } catch (error) {
      next(error);
    }
  };

  public createFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody: ICreateFoodItem = req.body;
      const foodItem = await this.foodItems.createFoodItem(reqBody);
      res.status(200).json({ message: 'Food Item created successfully', data: foodItem });
    } catch (error) {
      next(error);
    }
  };

  public updateFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const food_item_id: number = req.params.food_item_id as number;
      const reqBody: IUpdateFoodItem = req.body;
      const foodItem = await this.foodItems.updateFoodItem(reqBody, food_item_id);
      if (foodItem.length === 0) {
        res.status(404).json({ message: 'Food Item not found' });
      }
      res.status(200).json({ message: 'Food Item updated successfully', data: foodItem });
    } catch (error) {
      next(error);
    }
  };
}
