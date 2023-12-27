import { Service } from 'typedi';
import pg from '@database';
import { ICreateFoodItem, IUpdateFoodItem } from '@/interfaces/foodItem.interface';

@Service()
export class FoodItemService {
  public async findAllFoodItems(): Promise<ICreateFoodItem[]> {
    const query = 'SELECT * FROM food_items';
    const { rows } = await pg.query(query);
    return rows;
  }

  public async createFoodItem(foodItem: ICreateFoodItem, donor_id: number): Promise<ICreateFoodItem[]> {
    const query =
      'INSERT INTO food_items (name, description, quantity, expiry_date, dietary_restrictions, image_url, donor_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      foodItem.name,
      foodItem.description,
      foodItem.quantity,
      foodItem.expiry_date,
      foodItem.dietary_restrictions,
      foodItem.image_url,
      donor_id,
    ];
    const { rows } = await pg.query(query, values);
    return rows;
  }
  public async updateFoodItem(foodItem: IUpdateFoodItem, food_item_id: number): Promise<ICreateFoodItem[]> {
    const setClause = Object.keys(foodItem).map((key, index) => `${key} = '${foodItem[key]}'`);
    const updateQuery = `UPDATE FOOD_ITEMS SET ${setClause} WHERE food_item_id = $1 returning *`;
    const { rows } = await pg.query(updateQuery, [food_item_id]);
    return rows;
  }
}
