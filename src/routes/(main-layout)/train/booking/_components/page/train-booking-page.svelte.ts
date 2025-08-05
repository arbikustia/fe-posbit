import { capitalizeEachWord } from '$lib/helpers/string-helper';
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import type { z } from 'zod';
import { defaultPassenger } from './constants';
import { bookingSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

import { onMount } from 'svelte';

type TrainBookingPageState = {
	isOpenSelectSeatDialog: boolean;
};

const numberOfPaxes = {
	adult: 1,
	infant: 1
};

export function useTrainBookingPage() {
	const form = superForm(defaults(zod(bookingSchema)), {
		SPA: true,
		validators: zod(bookingSchema),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	const state = $state<TrainBookingPageState>({
		isOpenSelectSeatDialog: false
	});

	function generatePassengers() {
		const passengers: z.infer<typeof bookingSchema>['passengers'] = [];

		Object.keys(numberOfPaxes).forEach((key) => {
			const numberOfPax = numberOfPaxes[key as keyof typeof numberOfPaxes];

			for (let i = 0; i < numberOfPax; i++) {
				passengers.push({
					...defaultPassenger,
					ageGroup: key,
					alias: `${capitalizeEachWord(key)} ${i + 1}`
				});
			}
		});

		return passengers;
	}

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			toast.success('Book Now');
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
		state,
		form,
		formData,
		errors,
		enhance,
		handleSubmit
	};
}
