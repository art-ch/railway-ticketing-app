import { z } from 'zod';

export const PassengerDetailsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional()
});

export type PassengerDetails = z.infer<typeof PassengerDetailsSchema>;
