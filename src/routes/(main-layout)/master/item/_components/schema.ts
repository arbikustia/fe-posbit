import { z } from 'zod';

export const masterItemSchema = z.object({
	id: z.number().optional(),
	kode_barang: z.string().min(1, 'Kode Barang is required'),
	nama_barang: z.string().min(1, 'Item name is required'),
	deskripsi: z.string().min(1, 'Description is required'),
	qty_stok_toko: z
		.number({ invalid_type_error: 'Qty stok toko must be a number' })
		.nonnegative('Qty stok toko cannot be negative'),
	harga_beli: z
		.number({ invalid_type_error: 'Harga beli must be a number' })
		.nonnegative('Harga beli cannot be negative'),
	harga_jual: z
		.number({ invalid_type_error: 'Harga jual must be a number' })
		.nonnegative('Harga jual cannot be negative'),
	jumlah: z
		.number({ invalid_type_error: 'Qty must be a number' })
		.nonnegative('Qty cannot be negative'),
	open: z.boolean().optional().default(true)
});

export type MasterItemSchema = z.infer<typeof masterItemSchema>;
