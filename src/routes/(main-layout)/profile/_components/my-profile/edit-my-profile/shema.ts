// import { z } from 'zod';

// export const profileSchema = z.object({
// 	title: z.enum(['MR', 'MRS', 'MS']),
// 	firstName: z.string().min(1, 'First name is required'),
// 	lastName: z.string().min(1, 'Last name is required'),
// 	email: z.string().email(),
// 	mobile: z.string().min(10),
// 	company: z.string().optional()
// });

// export type Profile = z.infer<typeof profileSchema>;


// lib/schemas/profileSchema.ts
import { z } from 'zod';

export const profileSchema = z.object({
	title: z.enum(['MR', 'MRS', 'MS']),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	singleWordName: z.boolean().default(false),
	company: z.string().optional(),
	email: z.string().email('Invalid email address'),
	mobilePhone: z.string().min(1, 'Mobile phone is required'),
	countryCode: z.string().default('+62'),
	profilePicture: z.string().optional()
});

export type IprofileSchema = {
	title: 'MR' | 'MRS' | 'MS',
	firstName: string,
	lastName: string
	singleWordName: boolean,
	company: string,
	email: string,
	mobilePhone: string,
	countryCode?: string,
	profilePicture?: string
};


export type ProfileFormData = IprofileSchema;

export const defaultFormData: Partial<IprofileSchema> = {
	title: 'MS',
	firstName: 'NI MADE FELICIA AUDREY',
	lastName: 'WIJAYA',
	company: 'RSP (Reka Sinergi Pratama) COM00001',
	email: 'emailcontoh@gmail.com',
	mobilePhone: '811-123-1234',
	countryCode: '+62'
};