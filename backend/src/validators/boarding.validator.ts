import { z } from 'zod';

export const verifyBoardingSchema = z.object({
  token: z.string().min(1, 'QR verification token or ticket number is required'),
  tripId: z.string().optional(),
  verificationDevice: z.string().optional().default('Driver Mobile Scanner Terminal'),
});
