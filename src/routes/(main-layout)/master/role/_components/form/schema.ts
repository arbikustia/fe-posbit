// schema.ts
import { z } from 'zod';

export const roleSchema = z.object({
  role: z.string().min(1, 'Role is required')
});
