import { Container } from 'typedi';
import { DonationService } from '@/services/donations.service';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { X_API_KEY } from '@/config';
import { getAuthorization } from '@/middlewares/auth.middleware';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { Roles } from '@/utils/constants';
import { HttpExpection } from '@/exceptions/httpException';

export class DonationController {
  public donations = Container.get(DonationService);

  /**
   * Handles donation requests from authenticated users.
   * Verifies user role and rejects donors.
   * Calls service layer to create donation request.
   * Returns 200 OK with donation data on success.
   * Passes any errors to the error handler middleware.
   */
  public requestDonation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getAuthorization(req);
      const { role } = (await verify(token, X_API_KEY)) as DataStoredInToken;
      if (role === Roles.DONOR) throw new HttpExpection(403, 'Donor is not allowed to access this resource ');
      const { food_item_id, recipient_id, quantity } = req.body;
      const donation = await this.donations.requestDonation(food_item_id, recipient_id, quantity);
      res.status(200).json({ message: 'Donation requested successfully', data: donation });
    } catch (error) {
      next(error);
    }
  };
}
