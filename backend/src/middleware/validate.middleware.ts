import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.utils';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        const errorMessage = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Validation error';
        return sendError(res, errorMessage, 422, 'VALIDATION_ERROR');
      }
      return sendError(res, 'Invalid request payload', 400, 'BAD_REQUEST');
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        const errorMessage = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Query validation error';
        return sendError(res, errorMessage, 422, 'VALIDATION_ERROR');
      }
      return sendError(res, 'Invalid query parameters', 400, 'BAD_REQUEST');
    }
  };
}
