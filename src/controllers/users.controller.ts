import { UsersService } from '@/services/users.service';
import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { ICreateUser, IUpdateUser } from '@/interfaces/users.interface';

/**
 * Controller class for managing user-related operations.
 */
export class UsersController {
  /**
   * Instance of the UsersService class.
   */
  public user = Container.get(UsersService);

  /**
   * Get all users.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.user.findAllUsers();
      res.status(200).json({ message: 'findAll', data: users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new user.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody: ICreateUser = req.body;
      const user = await this.user.createUser(reqBody);
      res.status(200).json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a user by username.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user_name: string = req.params.user_name;
      if (user_name) {
        const user = await this.user.getUser(user_name);
        if (user.length === 0) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        res.status(200).json({ message: 'User found', data: user });
      } else {
        next(new Error('User name not provided'));
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a user by username.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user_name: string = req.params.user_name;
      if (user_name) {
        console.log(req.params);
        const reqBody: IUpdateUser = req.body;
        const user = await this.user.updateUser(reqBody, user_name);
        res.status(200).json({ message: 'User updated successfully', data: user });
        return;
      } else {
        next(new Error('User name not provided'));
      }
    } catch (error) {
      next(error);
    }
  };
}
