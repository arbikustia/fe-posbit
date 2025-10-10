// schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
});
