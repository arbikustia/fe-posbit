import { z } from 'zod';

export const modalSchema = z.object({
	id: z
		.string()
		.uuid({ message: 'Invalid ID format, must be a UUID' })
		.optional(),
	cashier_id: z.string().min(1, 'Cashier ID is required'),

	// Untuk create → modal_awal
	modal_awal: z
		.preprocess((val) => {
			if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
			return val;
		}, z.number().default(0))
		.optional(),

	// Untuk update → actual_earning
	actual_earning: z
		.preprocess((val) => {
			if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
			return val;
		}, z.number().default(0))
		.optional(),

	is_modal_awal: z.boolean().default(true)
});

export type ModalSchema = z.infer<typeof modalSchema>;
