import { Router } from 'express';
import { IRoutes } from '@interfaces/routes.interface';
import { AuthController } from '@controllers/auth.controller';
import { RateLimiterMiddleware } from '@/middlewares/rateLimiter.middleware';

export class AuthRoute implements IRoutes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/signUp`, this.auth.signUp);
    this.router.post(`${this.path}/login`, RateLimiterMiddleware, this.auth.login);
  }
}
