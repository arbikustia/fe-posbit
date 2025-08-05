import type { ScheduleResult, Trip } from '$lib/types/FlightResponse';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';

export type ShareScheduleProps = {
	schedule: ScheduleResult;
	currentScheduleIdx: number;
	flightType: SearchFlightParam['flightType'];
	route: string;
};

export type ShareScheduleState = {
	selectedTrips: Trip[];
};

export type ShareScheduleItemProps = {
	trip: Trip;
	onCheck?: () => void;
	checked?: boolean;
	compact?: boolean;
	optionNumber?: number;
};
