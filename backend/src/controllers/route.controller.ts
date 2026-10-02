import { Request, Response } from 'express';
import { RouteService } from '../services/route.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class RouteController {
  static async getAllRoutes(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active !== 'false';
      const routes = await RouteService.getAllRoutes({ activeOnly });
      return sendSuccess(res, routes);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getPopularRoutes(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const routes = await RouteService.getPopularRoutes(limit);
      return sendSuccess(res, routes);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getRouteById(req: Request, res: Response) {
    try {
      const route = await RouteService.getRouteById(req.params.id);
      return sendSuccess(res, route);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createRoute(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const route = await RouteService.createRoute(req.body, userContext);
      return sendSuccess(res, route, 'Route created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateRoute(req: Request, res: Response) {
    try {
      const userContext = req.user
        ? { id: req.user.userId, email: req.user.email, role: req.user.role }
        : undefined;
      const route = await RouteService.updateRoute(req.params.id, req.body, userContext);
      return sendSuccess(res, route, 'Route updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
