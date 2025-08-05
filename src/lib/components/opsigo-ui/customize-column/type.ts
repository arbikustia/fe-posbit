import type z from 'zod';
import type { savePresetSchema } from './schema';

export type SavePresetSchema = z.infer<typeof savePresetSchema>;

export type defaultColumn = {
	id: number;
	access: string;
	presetName: string;
	keysColumn: string[];
};
export type ColumnItem = {
	index: number;
	field: string;
	header: string;
};
export interface CustomizeColumnItem extends ColumnItem {
	id: string;
	isActive: boolean;
}
