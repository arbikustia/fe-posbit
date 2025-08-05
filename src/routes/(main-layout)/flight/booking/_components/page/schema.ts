import { phoneRegex } from '$lib/regex';
import { z } from 'zod';

export const baggageSchema = z.object({
	tripIndex: z.number(),
	baggageName: z.string(),
	baggageId: z.string(),
	baggagePrice: z.number(),
	baggageCurrencyCode: z.string(),
	passengerIdx: z.number()
});

export const seatSchema = z.object({
	tripIndex: z.number(),
	segmentIndex: z.number(),
	seatNumber: z.string(),
	seatId: z.string(),
	seatPrice: z.number(),
	seatCurrencyCode: z.string(),
	passengerIdx: z.number()
});

export const mealSchema = z.object({
	tripIndex: z.number(),
	segmentIndex: z.number(),
	mealName: z.string(),
	mealId: z.string(),
	mealPrice: z.number(),
	mealCurrencyCode: z.string(),
	passengerIdx: z.number()
});

export const ancillarySchema = z.object({
	baggages: baggageSchema.array(),
	seats: seatSchema.array(),
	meals: mealSchema.array()
});

export const passengerSchema = z.object({
	title: z.string().min(1),
	firstName: z.string().min(3).max(30),
	lastName: z.string().min(3).max(30),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
	dateOfBirth: z.string().min(1, 'Date of birth is required'),
	email: z.string().email(),
	nationality: z.string().min(1, 'Nationality is required'),
	frequentFlyer: z.string(),
	passportNumber: z.string().min(1, 'Passport is required'),
	passportExpireDate: z.string().min(1, 'Expire Date is required'),
	passportCountryOfIssue: z.string().min(1, 'Country of Issue is required'),
	ageGroup: z.string(),
	alias: z.string(),
	remarks: z
		.object({
			number: z.number(),
			value: z.string().min(1)
		})
		.array()
});

export const bookingSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	firstName: z.string().min(3).max(30),
	lastName: z.string().min(3).max(30),
	email: z.string().email(),
	phone: z.string().regex(phoneRegex, 'Invalid Phone Number. ex : 085123456789'),
	passengers: passengerSchema.array(),
	ancillary: ancillarySchema
});
