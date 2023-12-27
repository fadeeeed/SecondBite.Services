import { HttpExpection } from '@/exceptions/httpException';
import { withTransaction } from '@database';
import { Service } from 'typedi';
@Service()
export class DonationService {
  /**
   * Requests a donation by creating a new donation record in the database.
   *
   * @param food_item_id - The ID of the food item being donated.
   * @param recipient_id - The ID of the recipient receiving the donation.
   * @param quantity - The quantity of the food item being donated.
   * @returns A Promise that resolves to a string representing the newly created donation record.
   * @throws HttpExpection if any of the required fields are missing, the food item is not found, or an error occurs while requesting the donation.
   */
  public async requestDonation(food_item_id: number, recipient_id: number, quantity: number): Promise<string> {
    return withTransaction(async client => {
      const food_item_query = `SELECT * FROM FOOD_ITEMS WHERE food_item_id = $1`;
      const { rows: food_item_data } = await client.query(food_item_query, [food_item_id]);
      if (!food_item_data.length) throw new HttpExpection(404, 'Food item not found');
      const donor_id: number = food_item_data[0].donor_id as number;
      const request_date: Date = new Date();

      const donation_query =
        'INSERT INTO DONATIONS(food_item_id, donor_id, recipient_id, quantity, request_time) VALUES($1, $2, $3, $4, $5) returning *';

      const { rows: donation_data } = await client.query(donation_query, [food_item_id, donor_id, recipient_id, quantity, request_date]);
      if (!donation_data.length) throw new HttpExpection(500, 'Error requesting donation');
      return donation_data[0];
    });
  }
}
