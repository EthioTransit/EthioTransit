import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    name: err.name,
  });

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const code = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR');
  const message = err.isOperational ? err.message : (statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : err.message);

  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}
