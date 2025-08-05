import { phoneRegex } from '$lib/regex';
import { z } from 'zod';

export const guestSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	firstName: z.string().min(3).max(30),
	lastName: z.string().min(3).max(30),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 85123456789'),
	remarks: z
		.object({
			number: z.number(),
			value: z.string(),
			file: z.instanceof(File).nullable()
		})
		.array()
});

export const remarkHotelSchema = z
	.object({
		bedType: z.boolean(),
		highFloor: z.boolean(),
		nonSmokingRoom: z.boolean(),
		checkInTime: z.boolean(),
		checkOutTime: z.boolean(),
		other: z.boolean(),
		checkInTimeValue: z.string().optional(),
		checkOutTimeValue: z.string().optional(),
		bedTypeValue: z.string().optional(),
		otherValue: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (data.bedType && data.bedTypeValue === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Bed type is required',
				path: ['bedTypeValue']
			});
		}
		if (data.checkInTime && data.checkInTimeValue === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Check-in time is required',
				path: ['checkInTimeValue']
			});
		}
		if (data.checkOutTime && data.checkOutTimeValue === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Check-out time is required',
				path: ['checkOutTimeValue']
			});
		}

		if (data.other && data.otherValue === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Other is required',
				path: ['otherValue']
			});
		}
	});

export const bookingSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	firstName: z.string().min(3).max(30),
	lastName: z.string().min(3).max(30),
	email: z.string().email(),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 85123456789'),
	guests: guestSchema.array(),
	remarksHotel: remarkHotelSchema.array()
});
