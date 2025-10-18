import { z } from 'zod';

export const customerSchema = z.object({
	id: z.number().optional(),
	customer_name: z.string().min(1, 'Customer name is required'),
	phone: z.string().min(10, 'Phone number is required'),
	is_member: z.boolean().default(false),
	member_since: z.string().nullable().optional(),
	member_code: z.string().nullable().optional(),
	point: z.number().nullable().optional().default(0)
});

export type CustomerSchema = z.infer<typeof customerSchema>;