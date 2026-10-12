// schema.ts
import { z } from 'zod';

export const invoiceSchema = z.object({
	customer_id: z.string(),
	point_used: z.number().min(0, 'Point Used must be 0 or greater'),
	point_earned: z.number().min(0, 'Point Earned must be 0 or greater'),
	payment_status: z.string().min(1, 'Payment status is required'),
	status_po: z.string().min(1, 'Status po is required'),
	total_amount: z.number().min(0, 'Total Amount must be 0 or greater'),
	final_amount: z.number().min(0, 'Final Amount must be 0 or greater'),
	discount_amount: z.number().min(0, 'Discount Amount must be 0 or greater'),
	payment_method: z.string().min(1, 'Payment Method is required'),
	package_id: z.string().min(1, 'Package ID is required'),
	labels: z.array(
		z.object({
			label_id: z.string(),
			qty: z.number().min(1, 'Quantity must be at least 1'),
			price: z.number().optional()
		})
	),
	ongkir: z.number().min(0, 'Ongkir must be 0 or greater'),
	details: z
		.array(
			z.object({
				item_id: z.string().min(1, 'Item ID is required'),
				qty: z.number().min(1, 'Quantity must be at least 1'),
				price: z.number().min(0, 'Price must be at least 0'),
				discount: z.number().min(0, 'Discount must be at least 0').optional(),
				qty_keluar: z.number().optional(),
				qty_delivery: z.number().optional()
			})
		)
		.nonempty('Details must contain at least one item')
});
