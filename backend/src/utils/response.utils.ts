import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response,
  message: string = 'Unable to complete request',
  statusCode: number = 400,
  code: string = 'ERROR'
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}
