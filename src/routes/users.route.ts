import { Router } from 'express';

import { UsersController } from '@/controllers/users.controller';
import { IRoutes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UsersRoute implements IRoutes {
  public path = '/users';
  public router = Router();
  public users = new UsersController();
  constructor() {
    this.initializeRoutes();
  }
  /**
   * Initialize routes for the users router.
   *
   ** Adds middleware and route handlers for:
   **- Getting all users
   ** - Creating a new user
   ** - Getting a user by username
   ** - Updating a user by username
   */
  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.users.createUser);
    this.router.use(this.path, AuthMiddleware);
    this.router.get(this.path, this.users.getUsers);
    this.router.get(`${this.path}/find/:user_name`, this.users.getUser);
    this.router.put(`${this.path}/update/:user_name`, this.users.updateUser);
  }
}
