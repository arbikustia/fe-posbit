import type { Trip } from '$lib/types/FlightResponse';
import type { Snippet } from 'svelte';

export type TabKey = 'detail' | 'fare-rules';

export type FlightDetailDialogProps = {
	isOpen: boolean;
	trip: Trip;
	classId: string;
	flightNumber?: number;
	additionalContent?: Snippet;
};

export type TabItem = {
	value: TabKey;
	label: string;
};
