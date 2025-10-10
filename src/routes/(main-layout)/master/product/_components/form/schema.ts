// schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  productName: z.string().min(1, 'Product Name is required'),
});
