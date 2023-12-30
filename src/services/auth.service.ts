import { Service } from 'typedi';
import pg from '@database';
import { ICreateUser, User } from '@/interfaces/users.interface';
import { HttpExpection } from '@/exceptions/httpException';
import { hash, compare } from 'bcrypt';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { sign } from 'jsonwebtoken';
import { X_API_KEY } from '@/config';

/**
 * Creates a JWT token for the given user.
 *
 * Stores the user's username, email and role in the token payload.
 * Sets the token expiration to 1 hour.
 * Signs the token using the application's secret key.
 *
 * Returns a TokenData object containing the generated token and expiration time.
 */
const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { user_name: user.user_name, email: user.email, role: user.role, id: user.user_id };
  const expiresIn: number = 60 * 60 * 6;
  return { expiresIn, token: sign(dataStoredInToken, X_API_KEY, { expiresIn }) };
};

/**
 * Creates an HTTP cookie containing the JWT auth token.
 *
 * The cookie is http-only and set to expire after the token expiration time.
 *
 * Returns the Set-Cookie header string.
 */
const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token};HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  /**
   * Creates a new user record in the database.
   *
   * Checks if a user with the given email already exists.
   * If not, hashes the password, inserts the new user data into the database,
   * and returns the created user object.
   *
   * Throws an HttpException with 409 conflict if the email already exists.
   */
  public async signUp(user: ICreateUser): Promise<User> {
    const { email, password } = user;
    const searchQuery = `SELECT user_id FROM USERS WHERE email = $1`;

    const { rowCount } = await pg.query(searchQuery, [email]);
    if (rowCount) throw new HttpExpection(409, 'The email already exists');

    const hashedPassword = await hash(password, 10);

    const createQuery =
      'INSERT INTO USERS(user_name, email, password, role, first_name, last_name, contact_number,address, location_longitude, location_latitude) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *';

    const { rows } = await pg.query(createQuery, [
      user.user_name,
      user.email,
      hashedPassword,
      user.role,
      user.first_name,
      user.last_name,
      user.contact_number,
      user.address,
      user.location_longitude,
      user.location_latitude,
    ]);

    return rows[0];
  }

  /**
   * Logs a user in by validating their email and password.
   *
   * Looks up the user by email, checks if the password matches,
   * generates a JWT token, and returns a cookie containing the token.
   *
   * Throws 404 if email not found, 401 if password invalid.
   *
   * @param userData - Object with email and password fields
   * @returns Promise resolving to the Set-Cookie header string
   */
  public async login(userData: ICreateUser): Promise<string> {
    const { email, password } = userData;
    const searchQuery = `SELECT * FROM USERS WHERE email = '${email}'`;
    const { rows, rowCount } = await pg.query(searchQuery);
    if (!rowCount) throw new HttpExpection(404, 'The email does not exist');
    const isPasswordValid: boolean = await compare(password, rows[0].password);
    if (!isPasswordValid) throw new HttpExpection(401, 'The password does not match');
    const tokenData: TokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);
    return cookie;
  }
}
