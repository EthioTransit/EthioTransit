import { Router } from 'express';
import { OperatorController } from '../controllers/operator.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createOperatorSchema, updateOperatorSchema } from '../validators/admin.validator';
import { UserRole } from '../types';

const router = Router();

router.get('/', OperatorController.getAllOperators);
router.get('/:id', OperatorController.getOperatorById);
router.get('/:id/stats', authenticate, OperatorController.getOperatorStats);

router.post(
  '/',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createOperatorSchema),
  OperatorController.createOperator
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR),
  validateBody(updateOperatorSchema),
  OperatorController.updateOperator
);

export default router;
