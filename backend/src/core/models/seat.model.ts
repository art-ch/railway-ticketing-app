import { z } from 'zod';

export const seatNumberSchema = z.number().min(1).max(10);

export const SeatSchema = z.object({
  seatNumber: seatNumberSchema,
  isBooked: z.boolean().default(false),
  bookingId: z.string().uuid().optional()
});

export type Seat = z.infer<typeof SeatSchema>;
