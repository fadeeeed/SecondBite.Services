import { Router } from 'express';
import { HealthCheckController } from '@/controllers/healthcheck.controller';

export class HealthCheckRoute {
  public path = '/healthcheck';
  public router = Router();
  public healthCheck = new HealthCheckController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.healthCheck.healthCheck);
  }
}
