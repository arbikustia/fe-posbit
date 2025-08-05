import { isNumericOnly } from '$lib/helpers/string-helper';
import { phoneRegex } from '$lib/regex';
import { z } from 'zod';

export const seatSchema = z.object({
	tripIndex: z.number(),
	segmentIndex: z.number(),
	seatNumber: z.string(),
	seatId: z.string(),
	seatPrice: z.number(),
	seatCurrencyCode: z.string(),
	passengerIdx: z.number()
});

export const passengerSchema = z
	.object({
		title: z.string().min(1),
		firstName: z.string().min(3).max(30),
		lastName: z.string(),
		phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
		dateOfBirth: z.string(),
		email: z.string().email(),
		idType: z.string().min(1, 'ID Type is required'),
		idNumber: z.string().min(1, 'ID Number is required'),
		ageGroup: z.string(),
		alias: z.string(),
		isSingleNameOnly: z.boolean()
		// remarks: z
		// 	.object({
		// 		number: z.number(),
		// 		value: z.string().min(1)
		// 	})
		// 	.array()
	})
	.superRefine((data, ctx) => {
		if (data.ageGroup === 'infant') {
			if (data.dateOfBirth === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Date of birth is required',
					path: ['dateOfBirth']
				});
			}
		}

		if (!data.isSingleNameOnly) {
			if (data.lastName.length < 3) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_small,
					minimum: 3,
					path: ['lastName'],
					inclusive: false,
					type: 'string'
				});
			}

			if (data.lastName.length > 30) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 30,
					path: ['lastName'],
					inclusive: false,
					type: 'string'
				});
			}
		}

		if (!isNumericOnly(data.idNumber)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['idNumber'],
				message: 'Only numeric letters are allowed'
			});
		}
	});

const bookingSchemaShape = {
	title: z.string().min(1, 'Title is required'),
	firstName: z.string().min(3).max(30),
	lastName: z.string(),
	isSingleNameOnly: z.boolean(),
	email: z.string().email(),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
	passengers: passengerSchema.array(),
	seats: seatSchema.array()
};

export function bookingSchemaSuperRefine(data: any, ctx: z.RefinementCtx) {
	if (!data.isSingleNameOnly) {
		if (data.lastName.length < 3) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_small,
				minimum: 3,
				path: ['lastName'],
				inclusive: false,
				type: 'string'
			});
		}

		if (data.lastName.length > 30) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				maximum: 30,
				path: ['lastName'],
				inclusive: false,
				type: 'string'
			});
		}
	}
}

export const bookingSchema = z.object(bookingSchemaShape).superRefine(bookingSchemaSuperRefine);
