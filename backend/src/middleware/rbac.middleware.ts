import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { sendError } from '../utils/response.utils';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    // SUPER_ADMIN has access to all admin operations
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'Access denied: You do not have permission to perform this action',
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
}

export function enforceOperatorOwnership(
  getOperatorId: (req: Request) => string | undefined
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    // Admins and SuperAdmins can bypass operator scoping
    if (req.user.role === UserRole.SUPER_ADMIN || req.user.role === UserRole.ADMIN) {
      return next();
    }

    if (req.user.role === UserRole.OPERATOR) {
      const targetOperatorId = getOperatorId(req);
      if (!req.user.operatorId || (targetOperatorId && req.user.operatorId !== targetOperatorId)) {
        return sendError(
          res,
          'Unauthorized: You are not authorized to view or manage data of another transportation operator.',
          403,
          'OPERATOR_ISOLATION_ERROR'
        );
      }
    }

    next();
  };
}
