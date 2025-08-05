import type { Trip } from '$lib/types/FlightResponse';
import type { HTMLAttributes } from 'svelte/elements';

export type FlightCardProps = {
	trip: Trip;
	selectedFlightClassId?: string;
	onclick: (selectedClassId: string) => void;
	onSelect: (selectedClassId: string) => void;
};
