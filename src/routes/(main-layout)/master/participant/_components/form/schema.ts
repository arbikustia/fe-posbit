// schema.ts
import { z } from 'zod';
export type RoleType = 'AUDITOR' | 'AUDITEE';

export const participantSchema = z.object({
  id_user: z.string().min(1, 'Participant Name is required'),
  role: z.array(z.enum(['AUDITOR', 'AUDITEE']))
    .min(1, 'At least one role is required')
});

export type IparticipantSchemaArray = {
  id_user: string;
  role: RoleType[];
};

export const defaultFormData: Partial<IparticipantSchemaArray> = {
  id_user: '',
  role: ['AUDITOR'],
};