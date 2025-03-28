import { z } from 'zod';
import { TrainSchema } from './train.model';
import { SeatSchema } from './seat.model';
import { PassengerDetailsSchema } from './passengerDetails.model';

export const BookingSchema = z.object({
  bookingId: z.string().uuid(),
  trainId: TrainSchema.shape.trainId,
  seatNumber: SeatSchema.shape.seatNumber,
  passengerDetails: PassengerDetailsSchema,
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  bookingTime: z.string().datetime()
});

export type Booking = z.infer<typeof BookingSchema>;
