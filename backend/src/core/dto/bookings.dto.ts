import { z } from 'zod';
import { TrainSchema, BookingSchema } from '../models';

export const CreateBookingDto = z.object({
  trainId: TrainSchema.shape.trainId,
  seatNumber: BookingSchema.shape.seatNumber,
  passengerDetails: BookingSchema.shape.passengerDetails
});

export const GetBookingDto = z.object({
  bookingId: BookingSchema.shape.bookingId
});

export const UpdateBookingStatusDto = z.object({
  status: BookingSchema.shape.status
});
