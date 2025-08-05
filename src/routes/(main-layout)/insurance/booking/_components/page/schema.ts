import { emailRegex, phoneRegex } from '$lib/regex';
import z from 'zod';

export const policyHolderSchemaShape = {
	type: z.string(),
	name: z.string(),
	phone: z.string(),
	email: z.string(),
	city: z.string(),
	postalCode: z.string(),
	address: z.string(),
	heirName: z.string(),
	relationship: z.string(),
	additionalEmail: z.string(),
	title: z.string(),
	placeOfBirth: z.string(),
	dateOfBirth: z.string(),
	idType: z.string(),
	idNumber: z.string()
};

export const travelerSchemaShape = {
	alias: z.string(),
	ageGroup: z.string(),
	title: z.string().min(1, 'Title is required'),
	fullName: z.string().min(1, 'Fullname is required'),
	placeOfBirth: z.string().min(1, 'Place of Birth is required'),
	dateOfBirth: z.string().min(1, 'Date of birth is required'),
	idType: z.string().min(1, 'ID Type is required'),
	idNumber: z.string().min(1, 'ID Number is required')
};

const policyHolderSchema = z.object(policyHolderSchemaShape);

export const travelerSchema = z
	.tuple([
		z.object({
			...travelerSchemaShape,
			email: z.string().email(),
			phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
			city: z.string().min(1, 'City is required'),
			postalCode: z.string().min(1, 'Postal Code is required'),
			address: z.string().min(1, 'Address is required')
		})
	])
	.rest(z.object(travelerSchemaShape));

const bookingSchemaShape = {
	type: z.string(),
	title: z.string().min(1, 'Title is required'),
	firstName: z.string().min(3).max(30),
	lastName: z.string(),
	isSingleNameOnly: z.boolean(),
	email: z.string().email(),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
	additionalBenefits: z.array(z.string()),
	travelers: travelerSchema.optional(),
	policyHolder: policyHolderSchema
};

export function policyHolderSchemaSuperRefine(data: any, ctx: z.RefinementCtx) {
	if (data.type === 'group') {
		if (!phoneRegex.test(data.policyHolder.phone)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid Phone Number. ex : 085123456789',
				path: ['policyHolder', 'phone']
			});
		}

		if (data.policyHolder.name.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Name is required',
				path: ['policyHolder', 'name']
			});
		}

		if (!emailRegex.test(data.policyHolder.email)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid Email',
				path: ['policyHolder', 'email']
			});
		}

		if (data.policyHolder.city.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'City is required',
				path: ['policyHolder', 'city']
			});
		}

		if (data.policyHolder.postalCode.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Postal Code is required',
				path: ['policyHolder', 'postalCode']
			});
		}

		if (data.policyHolder.address.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Address is required',
				path: ['policyHolder', 'address']
			});
		}

		if (data.policyHolder.heirName.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Heir Name is required',
				path: ['policyHolder', 'heirName']
			});
		}

		if (data.policyHolder.relationship.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Relationship is required',
				path: ['policyHolder', 'relationship']
			});
		}

		if (data.policyHolder.type !== 'traveler') {
			if (
				data.policyHolder.additionalEmail.length > 0 &&
				!emailRegex.test(data.policyHolder.additionalEmail)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Invalid Email',
					path: ['policyHolder', 'additionalEmail']
				});
			}
		} else {
			if (data.policyHolder.title.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Title is required',
					path: ['policyHolder', 'title']
				});
			}
			if (data.policyHolder.placeOfBirth.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Place of Birth is required',
					path: ['policyHolder', 'placeOfBirth']
				});
			}
			if (data.policyHolder.dateOfBirth.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Date of Birth is required',
					path: ['policyHolder', 'dateOfBirth']
				});
			}
			if (data.policyHolder.idType.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'ID Type is required',
					path: ['policyHolder', 'dateOfBirth']
				});
			}
			if (data.policyHolder.idNumber.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'ID Number is required',
					path: ['policyHolder', 'idNumber']
				});
			}
		}
	}
}

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

	policyHolderSchemaSuperRefine(data, ctx);
}

export const bookingSchema = z.object(bookingSchemaShape).superRefine(bookingSchemaSuperRefine);
