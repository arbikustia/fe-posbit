// schema.ts
import { z } from 'zod';

export const locationSchema = z.object({
  locationName: z.string().min(1, 'Location Name is required'),
});
