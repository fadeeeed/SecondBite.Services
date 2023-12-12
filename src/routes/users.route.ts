import { Router } from 'express';

import { UsersController } from '@/controllers/users.controller';
import { IRoutes } from '@interfaces/routes.interface';

export class UsersRoute implements IRoutes {
  public path = '/users';
  public router = Router();
  public users = new UsersController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.users.getUsers);
    this.router.post(`${this.path}/create`, this.users.createUser);
    this.router.get(`${this.path}/find/:user_name`, this.users.getUser);
  }
}
