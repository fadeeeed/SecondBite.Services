import { Router } from 'express';
import { IRoutes } from '@interfaces/routes.interface';
import { AuthController } from '@controllers/auth.controller';

export class AuthRoute implements IRoutes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/signUp`, this.auth.signUp);
    this.router.post(`${this.path}/login`, this.auth.login);
  }
}
