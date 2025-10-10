// schema.ts
import { z } from 'zod';

export const reportSchema = z.object({
  reportName: z.string().min(1, 'Report Name is required'),
});
