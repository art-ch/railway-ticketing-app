import { z } from 'zod';
import { TrainSchema } from './train.model';
import { SeatSchema } from './seat.model';

export const BookingSchema = z.object({
  bookingId: z.string().uuid(),
  trainId: TrainSchema.shape.trainId,
  seatNumber: SeatSchema.shape.seatNumber,
  passengerDetails: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  bookingTime: z.string().datetime()
});

export type Booking = z.infer<typeof BookingSchema>;
