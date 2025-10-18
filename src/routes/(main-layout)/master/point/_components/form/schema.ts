import { z } from 'zod';

export const pointSchema = z.object({
  pointPerValue: z
    .string()
    .min(1, 'Amount per Point is required'),

  pointValue: z
    .string()
    .min(1, 'Point Value is required'),

  status: z
    .boolean({
      required_error: 'Status is required'
    })
});
