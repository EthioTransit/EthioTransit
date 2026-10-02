import { z } from 'zod';

export const createPaymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  provider: z.enum(['mock', 'telebirr', 'chapa', 'cbe_birr']).default('mock'),
  paymentMethod: z.string().default('Mock Instant Birr'),
});

export const verifyPaymentSchema = z.object({
  transactionReference: z.string().min(1, 'Transaction reference is required'),
  simulateResult: z.enum(['SUCCESS', 'FAILED']).optional().default('SUCCESS'),
});
