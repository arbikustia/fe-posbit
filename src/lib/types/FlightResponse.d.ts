export type FlightResponse = {
	provider: string;
	regionFormat: RegionFormat;
	hasSchedule: boolean;
	schedules: Schedules[];
};

export type ProviderProgress = {
	providerName: string;
	isDone: boolean;
	duration: number;
};

export type ScheduleResult = {
	origin: Location;
	destination: Location;
	departureDateTime: DateTime;
	trips: Trip[];
};

export type Schedules = {
	nextPageToken: string | null;
	trips: Trip[];
};

export type Trip = {
	provider: string;
	tripType: string;
	departureDateTime: DateTime;
	arrivalDateTime: DateTime;
	origin: Location;
	destination: Location;
	platingCarrier: PlatingCarrier;
	arrivesNextDay: boolean;
	transitCount: number;
	travelTime: string;
	classes: FlightClass[];
	segments: Segment[];

	// for ui key
	key: string;
};

export type MoneyFormat = {
	cultureCode: string;
	currencyCode: string;
	currencySymbol: string;
	decimalFormat: string;
	decimalSeparator: string;
	isMetric: boolean;
	numberOfDecimal: number;
	thousandSeparator: string;
	threeLetterCountryCode: string;
	twoLetterCountryCode: string;
};

export type DateTime = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	utcOffset?: number;
};

export type Airport = {
	code: string;
	name: string;
	terminal: string;
};

export type City = {
	name: string;
};

export type Country = {
	code: string;
	name: string;
};

export type Location = {
	airport: Airport;
	city: City;
	country: Country;
};

export type PlatingCarrier = {
	code: string;
	flightNumber: string;
	name: string;
	image: string;
};

export type Fare = {
	currency: string;
	total: number;
	paxFares: {
		base: {
			category: string;
			code: string;
			currency: string;
			total: number;
		};
		fareBasis: string;
		paxCount: number;
		paxType: string;
		total: number;
		equivalent: string | null;
		taxes: any[];
	}[];
};

export type FlightClass = {
	uniqueId: string;
	cabinClass: string | null;
	bookingClass: string;
	seatCount: string;
	fare: Fare;
	fareType: string | null;
	promoCode: string;
};

export type Aircraft = {
	code: string;
	shortName: string;
	longName: string;
};

export type Segment = {
	uniqueId: string;
	departureDateTime: DateTime;
	arrivalDateTime: DateTime;
	origin: Location;
	destination: Location;
	marketingCarrier: PlatingCarrier;
	operatingCarrier: PlatingCarrier | null;
	flightTime: string;
	transitTime: string;
	openJaw: boolean;
	classes: FlightClass[];
	aircraft: Aircraft;
	facilities: any[];
	legs: any[];
};
