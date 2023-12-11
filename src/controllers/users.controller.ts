import { UsersService } from '@/services/users.services';
import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';

export class UsersController {
  public user = Container.get(UsersService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.user.findAllUsers();
      res.status(200).json({ data: users, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}
