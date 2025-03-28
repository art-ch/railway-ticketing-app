import { z } from 'zod';
import { TrainSchema } from 'railway-ticketing-app-sdk';

export const GetTrainDto = z.object({
  trainId: TrainSchema.shape.trainId
});
