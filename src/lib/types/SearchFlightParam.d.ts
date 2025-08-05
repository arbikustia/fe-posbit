export type SearchFlightParam = {
	flightType: 'oneway' | 'roundtrip' | 'multicity';
	companyCode: string;
	adult: number;
	child: number;
	infant: number;
	preferredProviders: number[];
	route?: Route;
	multicityRoutes?: Route[];
};

export type Route = {
	origin: string;
	destination: string;
	departureDate: string;
	returnDate?: string;
};
