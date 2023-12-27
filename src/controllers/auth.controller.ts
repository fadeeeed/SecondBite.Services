import { AuthService } from '@/services/auth.service';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

export class AuthController {
  public authService = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody = req.body;
      const user = await this.authService.signUp(reqBody);
      res.status(200).json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody = req.body;
      const cookie = await this.authService.login(reqBody);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ message: 'User logged in successfully', token: cookie.split(';')[0].split('=')[1] });
    } catch (error) {
      next(error);
    }
  };
}
