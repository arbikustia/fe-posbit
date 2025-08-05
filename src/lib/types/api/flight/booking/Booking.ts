import type { DateTime, Location, Segment } from '$lib/types/FlightResponse';

export interface BookingCustomer {
	name: string;
	code: string;
}

export interface BookingBy {
	userName: string;
	name: string;
	companyName: string;
}

export interface BookingContact {
	name: string;
	email: string;
	phone: string;
}

export interface BookingPrice {
	fareDetails: FareDetail[];
	total: number;
	currencySymbol: string;
	currency: string;
}

export interface FareDetail {
	code: string;
	label: string;
	amount: number;
}

export interface BookingHistory {
	dateTime: DateTime;
	title: string;
	actor: BookingBy;
	description: string;
}

export interface BookingPassenger {
	index: number;
	fullName: string;
	type: string;
	phone: string;
	membership: Membership;
	passport: Passport;
	dateOfBirth: string;
	ticketNumber: string;
	flightAncillaries: FlightAncillary[];
}

export interface Membership {
	number: string;
	type: string;
}

export interface Passport {
	number: string;
	issuedDate: string;
	expiryDate: string;
}

export interface FlightAncillary {
	flightIndex: number;
	origin: string;
	destination: string;
	segments: AncillarySegment[];
}

export interface AncillarySegment {
	segmentIndex: number;
	origin: string;
	destination: string;
	ancillaries: Ancillary[];
}

export interface Ancillary {
	code: string;
	name: string;
	amount: number;
	currency: string;
	currencySymbol: string;
	seatNumber?: string;
}

export interface BookingPnr {
	pnrCode: string;
	provider: string;
	providerImage: string;
	timeLimit: DateTime;
	tripType: string;
	flightType: string;
	flights: Flight[];
}

export interface Flight {
	index: number;
	departureDateTime: DateTime;
	arrivalDateTime: DateTime;
	origin: Location;
	destination: Location;
	travelTime: string;
	segments: Segment[];
}

export interface Booking {
	bookingId: string;
	customer: BookingCustomer;
	bookingBy: BookingBy;
	createdDateTime: DateTime;
	bookingDateTime: DateTime;
	issuedDate: null;
	remarks: any[];
	bookingContact: BookingContact;
	passengers: BookingPassenger[];
	price: BookingPrice;
	attachments: any[];
	histories: BookingHistory[];
	pnrs: BookingPnr[];
}
