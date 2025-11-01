// schema-create.ts
import { z } from 'zod';

export const modalCreateSchema = z.object({
	cashier_id: z.string().min(1, 'Cashier ID is required'),
	modal_awal: z.preprocess((val) => {
		if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
		return val;
	}, z.number().refine(v => !Number.isNaN(v), { message: 'Modal awal harus angka' })),
	// is_modal_awal always true for create (optional, but keep for consistency)
	is_modal_awal: z.literal(true).optional()
});

export type ModalCreate = z.infer<typeof modalCreateSchema>;


// schema-update.ts

export const modalUpdateSchema = z.object({
	id: z.string().min(1, 'ID is required for update'),
	cashier_id: z.string().min(1, 'Cashier ID is required'),
	actual_earning: z.preprocess((val) => {
		if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
		return val;
	}, z.number().refine(v => !Number.isNaN(v), { message: 'Actual earning harus angka' })),
	is_modal_awal: z.literal(false).optional()
});

export type ModalUpdate = z.infer<typeof modalUpdateSchema>;
