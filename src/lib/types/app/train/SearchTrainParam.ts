export type SearchTrainParam = {
	trainType: string;
	tripType: 'oneway' | 'roundtrip';
	companyCode: string;
	adult: number;
	infant: number;
	route?: Route;
};

export type Route = {
	origin: string;
	destination: string;
	departureDate: string;
	returnDate?: string;
};
