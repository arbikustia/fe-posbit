import type { Trip } from '$lib/types/FlightResponse';
import type { Snippet } from 'svelte';
import type { z } from 'zod';
import type { baggageSchema, mealSchema, passengerSchema, seatSchema } from '../page/schema';

export type FlightAncillaryProps = {
	title: string;
	iconSrc: string;
	actionTitle: string;
	action?: () => void;
	summaryContent?: Snippet;
};

export type FlightAncillaryBaggageSummaryProps = {
	baggages: z.infer<typeof baggageSchema>[];
	trips: Trip[];
};

export type FlightAncillarySeatSummaryProps = {
	seats: z.infer<typeof seatSchema>[];
	passengers: z.infer<typeof passengerSchema>[];
	trips: Trip[];
};

export type FlightAncillaryMealSummaryProps = {
	meals: z.infer<typeof mealSchema>[];
	passengers: z.infer<typeof passengerSchema>[];
	trips: Trip[];
};
