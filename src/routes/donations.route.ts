import { Router } from 'express';
import { IRoutes } from '@interfaces/routes.interface';
import { DonationController } from '@controllers/donations.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
export class DonationRoute implements IRoutes {
  public path = '/donations';
  public router = Router();
  public donations = new DonationController();
  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.router.use(this.path, AuthMiddleware);
    this.router.post(`${this.path}/request`, this.donations.requestDonation);
  }
}
