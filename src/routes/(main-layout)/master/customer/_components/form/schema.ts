import { z } from 'zod';

export const customerSchema = z.object({
	id: z.string().uuid().optional(),
	customer_name: z.string().min(1, 'Customer name is required'),
	phone: z.string().min(10, 'Phone number must be at least 10 digits'),
	is_member: z.boolean().default(false),
	point: z.preprocess((val) => {
		if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
		return val;
	}, z.number().default(0).optional()),
	type: z.enum(['REGULAR', 'PREMIUM']).default('REGULAR')
});

export type CustomerSchema = z.infer<typeof customerSchema>;
