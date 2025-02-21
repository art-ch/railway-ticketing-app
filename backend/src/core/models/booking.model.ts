import { z } from 'zod';
import { seatNumberSchema } from './seat.model';

export const BookingSchema = z.object({
  bookingId: z.string().uuid(),
  trainId: z.string().uuid(),
  seatNumber: seatNumberSchema,
  passengerDetails: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  bookingTime: z.string().datetime()
});

export type Booking = z.infer<typeof BookingSchema>;
