import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { UserRole } from '../types';

const router = Router();

router.get(
  '/admin',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AnalyticsController.getAdminAnalytics
);

router.get(
  '/operator',
  authenticate,
  authorizeRoles(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AnalyticsController.getOperatorAnalytics
);

router.get(
  '/search/global',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  AnalyticsController.globalSearch
);

router.get(
  '/audit-logs',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AnalyticsController.getAuditLogs
);

router.get('/notifications', authenticate, AnalyticsController.getNotifications);
router.put('/notifications/:id/read', authenticate, AnalyticsController.markNotificationRead);

export default router;
