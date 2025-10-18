// schema.ts
import { z } from 'zod';

export const purchaseReportSchema = z.object({
  purchase_order_id: z.string().min(1, 'Purchase Order ID is required'),
  item_id: z.string().min(1, 'Item is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
});
