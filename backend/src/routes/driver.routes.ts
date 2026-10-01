import { Router } from 'express';
import { DriverController } from '../controllers/driver.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createDriverSchema, updateDriverSchema } from '../validators/admin.validator';
import { UserRole } from '../types';

const router = Router();

router.get('/my/dashboard', authenticate, authorizeRoles(UserRole.DRIVER), DriverController.getMyDriverDashboard);
router.get('/manifest/:tripId', authenticate, authorizeRoles(UserRole.DRIVER, UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), DriverController.getTripManifest);

router.get('/', authenticate, DriverController.getDrivers);
router.get('/:id', authenticate, DriverController.getDriverById);

router.post(
  '/',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  validateBody(createDriverSchema),
  DriverController.createDriver
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  validateBody(updateDriverSchema),
  DriverController.updateDriver
);

export default router;
