import { z } from 'zod';

import { SeatSchema } from './seat.model';

export const TrainSchema = z.object({
  trainId: z.string().uuid(),
  trainType: z.enum(['local', 'long-distance', 'express']),
  name: z.string().min(1),
  departureStation: z.string(),
  arrivalStation: z.string(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),
  seats: z.array(SeatSchema).length(10)
});

export type Train = z.infer<typeof TrainSchema>;
