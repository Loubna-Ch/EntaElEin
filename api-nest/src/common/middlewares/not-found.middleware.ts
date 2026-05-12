import { NextFunction, Request, Response } from 'express';
import { ApiError } from './api-error';

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
