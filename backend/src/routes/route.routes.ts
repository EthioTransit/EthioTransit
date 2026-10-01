import { Router } from 'express';
import { RouteController } from '../controllers/route.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createRouteSchema, updateRouteSchema } from '../validators/admin.validator';
import { UserRole } from '../types';

const router = Router();

router.get('/', RouteController.getAllRoutes);
router.get('/popular', RouteController.getPopularRoutes);
router.get('/:id', RouteController.getRouteById);

router.post(
  '/',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createRouteSchema),
  RouteController.createRoute
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(updateRouteSchema),
  RouteController.updateRoute
);

export default router;
