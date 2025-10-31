import { z } from 'zod';

export const customerSchema = z.object({
	id: z.number().optional(),
	customer_name: z.string().min(1, 'Customer name is required'),
	phone: z.string().min(10, 'Phone number must be at least 10 digits'),
	is_member: z.boolean().default(false),
	member_since: z.string().nullable().optional(),
	member_code: z.string().optional().default(''),
	point: z.preprocess((val) => {
		if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
		return val;
	}, z.number().default(0)),
	type: z.enum(['REGULAR', 'PREMIUM']).default('REGULAR')
});

export type CustomerSchema = z.infer<typeof customerSchema>;
