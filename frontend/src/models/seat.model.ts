import { z } from 'zod';

export const SeatSchema = z.object({
  seatNumber: z.number().min(1).max(10),
  isBooked: z.boolean().default(false),
  bookingId: z.string().uuid().optional()
});

export type Seat = z.infer<typeof SeatSchema>;
