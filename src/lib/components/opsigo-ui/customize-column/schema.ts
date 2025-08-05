import z from 'zod';

export const savePresetSchema = z.object({
	presetName: z.string().min(1, 'Preset Name is required').default(''),
	access: z.enum(['user', 'self', 'all', ''], {
		required_error: 'Access selection is required'
	})
});
