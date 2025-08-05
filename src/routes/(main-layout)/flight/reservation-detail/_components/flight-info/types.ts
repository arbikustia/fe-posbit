import type { DateTime, Segment } from '$lib/types/FlightResponse';

export type FlightInfoProps = {
	arriveDate?: DateTime;
	segment: Segment;
};
