// schema.ts
import { z } from 'zod';

export const userSchema = z.object({
	userName: z.string().min(1, 'User Name is required'),
	email: z.string().nonempty('Email is required').email('Invalid email address'),
	password: z
		.string()
		.min(10, 'Password must be at least 10 characters')
		.regex(
			/(?=.*[A-Z])(?=.*\d).*/,
			'Password must contain at least one uppercase letter and one number'
		),
	role: z.string().min(1, 'Role is required'),
	is_active: z.boolean().default(true)
});
