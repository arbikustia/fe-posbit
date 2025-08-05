import type { Trip, FlightClass } from '$lib/types/FlightResponse';

export type FlightSelectionSummaryProps = {
	open: boolean;
	trips: Trip[];
	flightClasses: FlightClass[];
};
