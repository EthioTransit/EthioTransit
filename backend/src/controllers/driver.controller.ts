import { Request, Response } from 'express';
import { DriverService } from '../services/driver.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { UserRole } from '../types';

export class DriverController {
  static async getDrivers(req: Request, res: Response) {
    try {
      let operatorId = req.query.operatorId as string | undefined;

      if (req.user && req.user.role === UserRole.OPERATOR) {
        operatorId = req.user.operatorId;
      }

      const drivers = await DriverService.getDrivers({ operatorId });
      return sendSuccess(res, drivers);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getDriverById(req: Request, res: Response) {
    try {
      const driver = await DriverService.getDriverById(req.params.id);
      return sendSuccess(res, driver);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createDriver(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;

      const payload = { ...req.body };
      if (req.user && req.user.role === UserRole.OPERATOR && req.user.operatorId) {
        payload.operator = req.user.operatorId;
      }

      const driver = await DriverService.createDriver(payload, userContext);
      return sendSuccess(res, driver, 'Driver created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateDriver(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const driver = await DriverService.updateDriver(req.params.id, req.body, userContext);
      return sendSuccess(res, driver, 'Driver updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getMyDriverDashboard(req: Request, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const driver = await DriverService.getDriverByUserId(req.user.userId);
      if (!driver) {
        return sendError(res, 'Driver profile not linked to this user account', 404);
      }
      const dashboard = await DriverService.getDriverDashboard(driver._id.toString());
      return sendSuccess(res, dashboard);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getTripManifest(req: Request, res: Response) {
    try {
      const manifest = await DriverService.getPassengerManifest(req.params.tripId);
      return sendSuccess(res, manifest);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }
}
