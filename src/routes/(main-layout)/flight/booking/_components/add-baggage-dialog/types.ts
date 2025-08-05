import type { SuperForm } from 'sveltekit-superforms';
import type { z } from 'zod';
import type { bookingSchema } from '../page/schema';
import type { Baggage } from '$lib/types/api/flight/ancillary/Baggage';

export type AddBaggageDialogProps = {
	open: boolean;
	form: SuperForm<z.infer<typeof bookingSchema>>;
};

export type AddBaggageDialogState = {
	selectedTripIndex: number;
	availableBaggageOptions: Baggage[];
};
