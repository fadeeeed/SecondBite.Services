import { Router } from 'express';

import { UsersController } from '@/controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';

export class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public users = new UsersController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.users.getUsers);
  }
}
