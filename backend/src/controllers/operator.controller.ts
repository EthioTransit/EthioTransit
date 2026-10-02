import { Request, Response } from 'express';
import { OperatorService } from '../services/operator.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class OperatorController {
  static async getAllOperators(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active === 'true';
      const operators = await OperatorService.getAllOperators(activeOnly);
      return sendSuccess(res, operators);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getOperatorById(req: Request, res: Response) {
    try {
      const operator = await OperatorService.getOperatorById(req.params.id);
      return sendSuccess(res, operator);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createOperator(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const operator = await OperatorService.createOperator(req.body, userContext);
      return sendSuccess(res, operator, 'Operator created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateOperator(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const operator = await OperatorService.updateOperator(req.params.id, req.body, userContext);
      return sendSuccess(res, operator, 'Operator updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getOperatorStats(req: Request, res: Response) {
    try {
      const stats = await OperatorService.getOperatorStats(req.params.id);
      return sendSuccess(res, stats);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
