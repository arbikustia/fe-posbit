// schema.ts
import { z } from 'zod';

export const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department Name is required'),
});
