import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { GeneralError } from '../error';

export interface JwtPayload {
  user_id: string;
  id: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw {
      errorType: 'UNAUTHORIZED',
      name: 'authentication error',
      message: 'missing or invalid auth header',
    } as GeneralError;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.secretKey) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    throw {
      errorType: 'UNAUTHORIZED',
      name: 'authentication error',
      message: 'authentication error, token apparently invalid',
      token: token,
    } as GeneralError;
  }
}
