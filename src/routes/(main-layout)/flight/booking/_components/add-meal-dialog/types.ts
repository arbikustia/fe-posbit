import type { SuperForm } from 'sveltekit-superforms';
import type { z } from 'zod';
import type { bookingSchema } from '../page/schema';
import type { Meal } from '$lib/types/api/flight/ancillary/Meal';
import type { Trip } from '$lib/types/FlightResponse';

export type AddMealDialogProps = {
	open: boolean;
	isMultiCity?: boolean;
	form: SuperForm<z.infer<typeof bookingSchema>>;
	trips: Trip[];
};

export type AddMealDialogState = {
	mealSegments: Meal[];
	selectedPassengerIdx: number;
	selectedSegment: Meal;
	showLimitError: boolean;
};
