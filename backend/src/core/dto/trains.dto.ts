import { z } from 'zod';
import { TrainSchema } from '../models';

export const GetTrainDto = z.object({
  trainId: TrainSchema.shape.trainId
});
