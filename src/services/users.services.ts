import { Service } from 'typedi';
import pg from '@database';
import { ICreateUser } from '@/interfaces/users.interface';

@Service()
export class UsersService {
  public async findAllUsers(): Promise<any> {
    const { rows } = await pg.query('SELECT * FROM USERS');
    console.log(rows);
    return rows;
  }

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

  public async getUser(user_name: string): Promise<ICreateUser[]> {
    const query = 'SELECT * FROM USERS WHERE user_name = $1';
    const { rows } = await pg.query(query, [user_name]);
    return rows;
  }
}
