export interface MealItem {
	Price: number;
	Code: string;
	CurrencyCode: string;
	Name: string;
	Image: string;
}

export interface Meal {
	TripIndex: number;
	SegmentIndex: number;
	Origin: string;
	Destination: string;
	Items: MealItem[];
}
