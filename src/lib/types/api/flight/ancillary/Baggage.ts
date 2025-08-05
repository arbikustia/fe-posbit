export interface BaggageItem {
	Amount: number;
	Code: string;
	CurrencyCode: string;
	Quantity: string;
}

export interface Baggage {
	TripIndex: number;
	SegmentIndex: number;
	Origin: string;
	Destination: string;
	Items: BaggageItem[];
}
