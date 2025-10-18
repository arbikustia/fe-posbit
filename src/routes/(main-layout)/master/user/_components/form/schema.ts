// schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required')
});
