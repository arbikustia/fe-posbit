export interface SeatColumn {
	IsSeat: boolean;
	PriceAdult?: number;
	PriceChild?: number;
	Currency: string;
	SeatNumber: string;
	SeatCode: string;
	SeatColumn: string;
	SeatName?: string;
	IsAvailable: boolean;
}

export interface SeatRow {
	Number: string;
	columns: SeatColumn[];
}

export interface SeatMapSegment {
	TripIndex: number;
	SegmentIndex: number;
	Aircraft: string;
	ArrivalDate: string | null;
	ArrivalTime: string | null;
	Duration: string | null;
	Key: string;
	Origin: string;
	DepartureDate: string;
	DepartureTime: string;
	Destination: string;
	MarketingCarrier: string;
	MarketingImage: string;
	MarketingFlightNumber: string;
	OperatingCarrier: string | null;
	OperatingImage: string | null;
	OperatingFlightNumber: string | null;
	SubClass: string;
	Rows: SeatRow[];
}
