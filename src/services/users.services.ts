import { Service } from 'typedi';
import pg from '@database';

@Service()
export class UsersService {
  public async findAllUsers(): Promise<any> {
    const { rows } = await pg.query('SELECT * FROM USERS');
    console.log(rows);
    return rows;
  }
}
