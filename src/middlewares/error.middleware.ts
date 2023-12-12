import { HttpExpection } from '@/exceptions/httpException';
import { Response, Request, NextFunction } from 'express';

export const ErrorMiddleware = (error: HttpExpection, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Unexpected Error Occured';
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
