// schema.ts
import { z } from 'zod';

// Schema untuk Audit Schedule
export const auditScheduleSchema = z.object({
  audit_plan_id: z.string().uuid('Audit plan is required'),
  id_location_audit: z.string().uuid('Audit location is required'),
  id_department_audit: z.string().uuid('Department audit is required'),
  id_auditor: z.string().uuid('Auditor is required'),
  id_auditee: z.string().uuid('Auditor is required'),
  id_template: z.string().uuid('Template is required'),
  name: z.string().min(1, 'Audit schedule Name is required'),
  description: z.string(),
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
export type AuditSchedule = z.infer<typeof auditScheduleSchema>;