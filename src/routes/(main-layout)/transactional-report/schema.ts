import type { DateRange } from 'bits-ui';
import { z } from 'zod';

const dateSchema = z.object({
	createdDate: z.custom<DateRange>().default({ start: undefined, end: undefined }),
	ticketingDate: z.custom<DateRange>().default({ start: undefined, end: undefined }),
	departureDate: z.custom<DateRange>().default({ start: undefined, end: undefined })
});
const otherSchema = z.object({
	status: z.string().optional().default(''),
	agentType: z.string().optional().default(''),
	agent: z.string().optional().default(''),
	createdBy: z.string().optional().default(''),
	company: z.string().optional().default(''),
	// dyanmic
	trainType: z.string().optional().default(''),
	referenceCode: z.string().optional().default(''),
	source: z.string().optional().default(''),
	supplier: z.string().optional().default(''),
	bookingCode: z.string().optional().default(''),
	certificateNumber: z.string().optional().default(''),
	insuredPerson: z.string().optional().default(''),
	flightNumber: z.string().optional().default(''),
	pnrCode: z.string().optional().default(''),
	passengerName: z.string().optional().default(''),
	reservationCode: z.string().optional().default(''),
	guestName: z.string().optional().default('')
});

export const schema = dateSchema.merge(otherSchema).refine(
	(data) => {
		const isEmpty = (d: DateRange) => !d.start && !d.end;
		return !(
			isEmpty(data.createdDate) &&
			isEmpty(data.ticketingDate) &&
			isEmpty(data.departureDate)
		);
	},
	{
		message:
			'Please fill at least one of the following: Created Date, Ticketing Date, or Departure Date',
		path: ['createdDate']
	}
);

type SchemaType = z.infer<typeof otherSchema>;
type SchemaKey = keyof SchemaType;

type FieldType = {
	field: SchemaKey;
	label: string;
	placeholder: string;
	items?: any[];
};

const mainField: FieldType[] = [
	{
		field: 'status',
		label: 'Status',
		placeholder: 'Select Status',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'agentType',
		label: 'Agent Type',
		placeholder: 'Select Type',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'agent',
		label: 'Agent',
		placeholder: 'Select Agent',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'createdBy',
		label: 'Created By',
		placeholder: 'Select User',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'company',
		label: 'Company',
		placeholder: 'Select Company',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'company',
		label: 'Company',
		placeholder: 'Select Company',
		items: [{ value: 'issued', label: 'Issued' }]
	}
];

export const flightField: FieldType[] = [
	...mainField,
	{
		field: 'supplier',
		label: 'Supplier',
		placeholder: 'Select Supplier',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'flightNumber',
		label: 'Flight Number',
		placeholder: 'Type Flight Number...'
	},
	{
		field: 'pnrCode',
		label: 'PNR Code',
		placeholder: 'Type PNR Code...'
	},
	{
		field: 'passengerName',
		label: 'Passenger Name',
		placeholder: 'Type Passenger Name...'
	}
];

export const hotelField: FieldType[] = [
	...mainField,
	{
		field: 'source',
		label: 'Source',
		placeholder: 'Select Source',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'reservationCode',
		label: 'Reservation Code',
		placeholder: 'Type Reservation Code...'
	},
	{
		field: 'guestName',
		label: 'Guest Name',
		placeholder: 'Type Guest Name...'
	}
];

export const trainField: FieldType[] = [
	...mainField,
	{
		field: 'trainType',
		label: 'Train Type',
		placeholder: 'Select Train Type',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'reservationCode',
		label: 'Reservation Code',
		placeholder: 'Type Reservation Code...'
	},
	{
		field: 'pnrCode',
		label: 'PNR Code',
		placeholder: 'Type PNR Code...'
	},
	{
		field: 'passengerName',
		label: 'Passenger Name',
		placeholder: 'Type Passenger Name...'
	}
];

export const insuranceField: FieldType[] = [
	...mainField,
	{
		field: 'supplier',
		label: 'Supplier',
		placeholder: 'Select Supplier',
		items: [{ value: 'issued', label: 'Issued' }]
	},
	{
		field: 'bookingCode',
		label: 'Booking Code',
		placeholder: 'Type Booking Code...'
	},
	{
		field: 'certificateNumber',
		label: 'Certificate Number',
		placeholder: 'Type Certificate Number...'
	},
	{
		field: 'insuredPerson',
		label: 'Insured Person',
		placeholder: 'Type Insured Person...'
	}
];
