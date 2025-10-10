// schema.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  transactionName: z.string().min(1, 'Transaction Name is required'),
});
