import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuditService } from '../services/audit.service';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class AnalyticsController {
  static async getAdminAnalytics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getAdminAnalytics();
      return sendSuccess(res, data);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getOperatorAnalytics(req: Request, res: Response) {
    try {
      const operatorId = req.user?.operatorId || (req.query.operatorId as string);
      if (!operatorId) {
        return sendError(res, 'Operator ID is required', 400);
      }
      const data = await AnalyticsService.getOperatorAnalytics(operatorId);
      return sendSuccess(res, data);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async globalSearch(req: Request, res: Response) {
    try {
      const q = req.query.q as string;
      const data = await AnalyticsService.globalSearch(q);
      return sendSuccess(res, data);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getAuditLogs(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const data = await AuditService.getLogs(limit, page);
      return sendSuccess(res, data);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const notifications = await NotificationService.getUserNotifications(req.user.userId);
      return sendSuccess(res, notifications);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async markNotificationRead(req: Request, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const notification = await NotificationService.markAsRead(req.params.id, req.user.userId);
      return sendSuccess(res, notification);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
