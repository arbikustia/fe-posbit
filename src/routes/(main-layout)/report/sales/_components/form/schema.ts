// schema.ts
import { z } from 'zod';

export const salesSchema = z.object({
  item_id: z.string().min(1, 'Item is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  sale_id: z.string().min(1, 'Sale ID is required')
});
