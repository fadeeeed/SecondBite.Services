import { UsersService } from '@/services/users.services';
import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { ICreateUser } from '@/interfaces/users.interface';

export class UsersController {
  public user = Container.get(UsersService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.user.findAllUsers();
      res.status(200).json({ message: 'findAll', data: users });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody: ICreateUser = req.body;
      const user = await this.user.createUser(reqBody);
      res.status(200).json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user_name: string = req.params.user_name;
      const user = await this.user.getUser(user_name);
      if (user.length === 0) {
        res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User found', data: user });
    } catch (error) {
      next(error);
    }
  };
}
