import type { Baggage } from './Baggage';
import type { Meal } from './Meal';
import type { SeatMapSegment } from './SeatMap';

export type AncillaryResponse = {
	Baggages: Baggage[];
	Seats: SeatMapSegment[];
	Segments: SeatMapSegment[];
	Meals: Meal[];
};
