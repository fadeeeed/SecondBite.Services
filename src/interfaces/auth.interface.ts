import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  UserName: string;
  Email: string;
  Role: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
