// schema.ts
import { z } from 'zod';

export const invoiceSchema = z.object({
	customer_id: z.number(),
	point_used: z.number().min(0, 'Point Used must be 0 or greater'),
	point_earned: z.number().min(0, 'Point Earned must be 0 or greater'),
	status: z.string().min(1, 'Status is required'),
	total_amount: z.number().min(0, 'Total Amount must be 0 or greater'),
	final_amount: z.number().min(0, 'Final Amount must be 0 or greater'),
	discount_amount: z.number().min(0, 'Discount Amount must be 0 or greater'),
	payment_method: z.string().min(1, 'Payment Method is required'),
	details: z
		.array(
			z.object({
				item_id: z.string().min(1, 'Item ID is required'),
				qty: z.number().min(1, 'Quantity must be at least 1'),
			})
		)
		.nonempty('Details must contain at least one item'),
});
