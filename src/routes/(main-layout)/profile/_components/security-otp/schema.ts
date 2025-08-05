import { z } from 'zod';

export const securitySchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z
		.string()
		.min(1, 'New password is required')
		.min(8, 'New password must be at least 8 characters long'),
	reTypeNewPassword: z.string().min(1, 'Re-type new password is required'),
}).refine((data) => data.newPassword === data.reTypeNewPassword, {
	message: 'New password and re-type password must match',
	path: ['reTypeNewPassword'], // This will show the error on the reTypeNewPassword field
});