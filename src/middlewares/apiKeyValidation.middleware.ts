import { X_API_KEY } from '@/config';
import { Request, Response, NextFunction } from 'express';
export const apiKeyValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && isValidateApiKey(apiKey.toString())) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};

const isValidateApiKey = (xApiKey: string) => {
  return xApiKey === X_API_KEY;
};
