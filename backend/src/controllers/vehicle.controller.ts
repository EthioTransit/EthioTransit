import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { UserRole } from '../types';

export class VehicleController {
  static async getVehicles(req: Request, res: Response) {
    try {
      let operatorId = req.query.operatorId as string | undefined;

      // Operator role isolation
      if (req.user && req.user.role === UserRole.OPERATOR) {
        operatorId = req.user.operatorId;
      }

      const activeOnly = req.query.active === 'true';
      const vehicles = await VehicleService.getVehicles({ operatorId, activeOnly });
      return sendSuccess(res, vehicles);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getVehicleById(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      return sendSuccess(res, vehicle);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createVehicle(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;

      // If operator is logged in, force their operatorId
      const payload = { ...req.body };
      if (req.user && req.user.role === UserRole.OPERATOR && req.user.operatorId) {
        payload.operator = req.user.operatorId;
      }

      const vehicle = await VehicleService.createVehicle(payload, userContext);
      return sendSuccess(res, vehicle, 'Vehicle created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateVehicle(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const vehicle = await VehicleService.updateVehicle(req.params.id, req.body, userContext);
      return sendSuccess(res, vehicle, 'Vehicle updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
