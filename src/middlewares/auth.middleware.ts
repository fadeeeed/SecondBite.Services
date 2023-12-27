import { X_API_KEY } from '@/config';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import pg from '@database';
import { HttpExpection } from '@/exceptions/httpException';

export const getAuthorization = (req: Request) => {
  const cookie = req.cookies?.Authorization;
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};
/**
 * Middleware function for authentication.
 * Verifies the authorization token in the request header and checks if the user is authorized.
 * If the user is authorized, the middleware passes the request to the next middleware.
 * If the user is not authorized, the middleware throws an HttpException with status code 401 (Unauthorized).
 * If the authorization token is not found in the request header, the middleware throws an HttpException with status code 404 (Not Found).
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 */
export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    if (Authorization) {
      const { UserName, Email, Role } = (await verify(Authorization, X_API_KEY)) as DataStoredInToken;
      const searchQuery = `SELECT * FROM users WHERE user_name = '${UserName}' AND email = '${Email}' AND role = '${Role}'`;
      const { rowCount } = await pg.query(searchQuery);
      if (!rowCount) next(new HttpExpection(401, 'Unauthorized'));
      else next();
    } else {
      next(new HttpExpection(404, 'Authorization token not found'));
    }
  } catch (error) {
    next(error);
  }
};
