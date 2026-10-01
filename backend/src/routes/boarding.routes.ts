import { Router } from 'express';
import { BoardingController } from '../controllers/boarding.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { verifyBoardingSchema } from '../validators/boarding.validator';
import { UserRole } from '../types';

const router = Router();

router.post(
  '/verify',
  authenticate,
  authorizeRoles(UserRole.DRIVER, UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(verifyBoardingSchema),
  BoardingController.verifyTicket
);

export default router;
