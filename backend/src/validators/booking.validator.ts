import { z } from 'zod';

export const lockSeatsSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  seatNumbers: z.array(z.string()).min(1, 'At least one seat must be selected'),
  guestLockId: z.string().optional(),
});

export const createBookingSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  seats: z.array(z.string()).min(1, 'At least one seat is required'),
  passengers: z
    .array(
      z.object({
        name: z.string().min(2, 'Passenger name is required'),
        phone: z.string().regex(/^(\+251|0)[79]\d{8}$/, 'Valid Ethiopian phone number required'),
        seatNumber: z.string().min(1, 'Seat number is required'),
        ageGroup: z.enum(['ADULT', 'CHILD']).default('ADULT'),
        idNumber: z.string().optional(),
      })
    )
    .min(1, 'At least one passenger info required'),
  guestLockId: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional().default('Passenger cancellation'),
});
