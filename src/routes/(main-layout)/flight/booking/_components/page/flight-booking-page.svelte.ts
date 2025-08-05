import { capitalizeEachWord } from '$lib/helpers/string-helper';
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import type { z } from 'zod';
import { defaultPassenger } from './constant';
import { bookingSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import dummyTrip from '$lib/dummy/trip.json';
import { onMount } from 'svelte';
import type { FlightBookingPageState } from './types';
import { goto } from '$app/navigation';

const numberOfSeats = {
	adult: 1,
	child: 1,
	infant: 1
};

export function useFlightBookingPage() {
	const form = superForm(defaults(zod(bookingSchema)), {
		SPA: true,
		validators: zod(bookingSchema),
		dataType: 'json',
		resetForm: false
	});

	const trips = [dummyTrip, dummyTrip]; //selected trips for temp use

	const { form: formData, enhance, validateForm, errors } = form;

	const state = $state<FlightBookingPageState>({
		isSelectSeatDialogOpen: false,
		isAddbaggageDialogOpen: false,
		isAddMealDialogOpen: false
	});

	function generatePassengers() {
		const passengers: z.infer<typeof bookingSchema>['passengers'] = [];

		Object.keys(numberOfSeats).forEach((key) => {
			const numberOfSeat = numberOfSeats[key as keyof typeof numberOfSeats];

			for (let i = 0; i < numberOfSeat; i++) {
				passengers.push({
					...defaultPassenger,
					ageGroup: key,
					alias: `${capitalizeEachWord(key)} ${i + 1}`,
					remarks: []
				});
			}
		});

		return passengers;
	}

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			// toast.success('Book Now');
			goto('/flight/reservation-detail');
		} else {
			toast.error('Please check your input');
		}
	}

	onMount(() => {
		// Initialize passengers
		formData.update((data) => {
			data.passengers = generatePassengers();
			return data;
		});
	});

	return {
		trips,
		state,
		form,
		formData,
		errors,
		enhance,
		handleSubmit
	};
}
