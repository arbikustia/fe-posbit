// schema.ts
import { z } from 'zod';

export const invoiceSchema = z.object({
	id: z.string().min(1, 'ID is required'),
	inv_number: z.string().min(1, 'Invoice Number is required'),
	item_id: z.string().min(1, 'Item ID is required'),
	cust_id: z.string().min(1, 'Customer ID is required'),
	point_used: z.number().min(0, 'Point Used must be a number'),
	point_earned: z.number().min(0, 'Point Earned must be a number'),
	status: z.string().min(1, 'Status is required'),
	total_amount: z.number().min(0, 'Total Amount is required'),
	final_amount: z.number().min(0, 'Final Amount is required'),
	discount_amount: z.number().min(0, 'Discount Amount is required'),
	payment_method: z.string().min(1, 'Payment Method is required')
});
