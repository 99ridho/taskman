import { Request, Response, NextFunction } from 'express';
import { GeneralError, HTTPError, toJson } from '../error';
import logger from '../logger';

export const errorHandler = (
  err: GeneralError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const errResp = toJson(err);

  logger.error(err.message, {
    type: err.errorType,
    details: err.details,
    payload: err.payload,
    name: err.name,
    timestamp: new Date().toISOString,
  });

  res.status(errResp.statusCode || 500).json({
    error: { ...errResp },
  });
};
