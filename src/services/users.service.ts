import { Service } from 'typedi';
import pg from '@database';
import { ICreateUser, IUpdateUser, User } from '@/interfaces/users.interface';
import { HttpExpection } from '@/exceptions/httpException';

@Service()
export class UsersService {
  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves to an array of User objects.
   */
  public async findAllUsers(): Promise<User[]> {
    const { rows } = await pg.query('SELECT * FROM USERS');
    const users: User[] = rows.map(row => ({
      user_id: row.user_id,
      user_name: row.user_name,
      email: row.email,
      role: row.role,
      first_name: row.first_name,
      last_name: row.last_name,
      contact_number: row.contact_number,
      address: row.address,
      location_longitude: row.location_longitude,
      location_latitude: row.location_latitude,
    }));
    return users;
  }

  /**
   * Creates a new user in the database.
   * @param user - The user object containing the user details.
   * @returns A promise that resolves to an array of created user objects.
   */
  public async createUser(user: ICreateUser): Promise<ICreateUser[]> {
    const createQuery =
      'INSERT INTO USERS(user_name, email, password, role, first_name, last_name, contact_number,address, location_longitude, location_latitude) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *';

    const { rows } = await pg.query(createQuery, [
      user.user_name,
      user.email,
      user.password,
      user.role,
      user.first_name,
      user.last_name,
      user.contact_number,
      user.address,
      user.location_longitude,
      user.location_latitude,
    ]);

    return rows;
  }

  /**
   * Retrieves a user from the database based on the provided user_name.
   * @param user_name - The username of the user to retrieve.
   * @returns A Promise that resolves to the retrieved User object.
   * @throws HttpExpection with status code 404 if the user is not found.
   */
  public async getUser(user_name: string): Promise<User> {
    const query = 'SELECT * FROM USERS WHERE user_name = $1';
    const { rows } = await pg.query(query, [user_name]);
    if (!rows.length) throw new HttpExpection(404, 'User not found');
    const user: User = {
      user_id: rows[0].user_id,
      user_name: rows[0].user_name,
      email: rows[0].email,
      role: rows[0].role,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      contact_number: rows[0].contact_number,
      address: rows[0].address,
      location_longitude: rows[0].location_longitude,
      location_latitude: rows[0].location_latitude,
    };
    return user;
  }

  /**
   * Updates a user in the database.
   * @param updateData - The data to update the user with.
   * @param user_name - The username of the user to update.
   * @returns A promise that resolves to an array of updated user objects.
   */
  public async updateUser(updateData: IUpdateUser, user_name: string): Promise<ICreateUser[]> {
    const setClause = Object.keys(updateData).map((key, index) => `${key} = '${updateData[key]}'`);
    const updateQuery = `UPDATE USERS SET ${setClause} WHERE user_name = $1 returning *`;
    const { rows } = await pg.query(updateQuery, [user_name]);
    return rows;
  }
}
