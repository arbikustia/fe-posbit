// schema.ts
import { z } from 'zod';

export const invoiceSchema = z.object({
  inv_id: z.string().min(1, 'Invoice ID is required'),
  description: z.string().min(1, 'Description is required')
});
