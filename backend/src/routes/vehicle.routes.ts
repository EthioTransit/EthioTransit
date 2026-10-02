import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createVehicleSchema, updateVehicleSchema } from '../validators/admin.validator';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, VehicleController.getVehicles);
router.get('/:id', authenticate, VehicleController.getVehicleById);

router.post(
  '/',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  validateBody(createVehicleSchema),
  VehicleController.createVehicle
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  validateBody(updateVehicleSchema),
  VehicleController.updateVehicle
);

export default router;
