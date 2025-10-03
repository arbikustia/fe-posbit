// schema.ts
import { z } from 'zod';

// Schema untuk Audit Plan
export const auditPlanSchema = z.object({
  name: z.string().min(1, 'Audit Plan Name is required'),
  id_category: z.string().uuid('Category ID must be a valid UUID'),
  audit_purpose: z.string().min(1, 'Audit Purpose is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start Date must be in YYYY-MM-DD format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End Date must be in YYYY-MM-DD format')
}).refine((data) => {
  // Validasi bahwa end_date harus setelah start_date
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true;
}, {
  message: "End Date must be after Start Date",
  path: ["end_date"]
});

// Tipe TypeScript yang di-generate dari schema
export type AuditPlan = z.infer<typeof auditPlanSchema>;