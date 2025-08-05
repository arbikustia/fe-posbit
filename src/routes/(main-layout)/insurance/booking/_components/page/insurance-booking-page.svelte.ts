import { defaults, superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ImportedTraveler } from '../import-traveler/types';
import { bookingSchema } from './schema';
import { onMount } from 'svelte';
import { toast } from 'svelte-sonner';
import { defaultTraveler } from './constants';
import type z from 'zod';
import { capitalizeEachWord } from '$lib/helpers/string-helper';
import { page } from '$app/state';

type InsuranceBookingPageState = {
	importedTravelers: ImportedTraveler[];
};

const numberOfPaxes = {
	adult: 1,
	child: 1
};

export function useInsuranceBookingPage() {
	const form = superForm(defaults(zod(bookingSchema)), {
		SPA: true,
		validators: zod(bookingSchema),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	const state = $state<InsuranceBookingPageState>({
		importedTravelers: []
	});

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			toast.success('Book Now');
		} else {
			toast.error('Please check your input');
		}
	}

	function generateTravelers() {
		const travelers: z.infer<typeof bookingSchema>['travelers'] = [
			{
				...defaultTraveler,
				email: '',
				phone: '',
				city: '',
				postalCode: '',
				address: '',
				ageGroup: 'adult',
				alias: 'Adult 1'
			}
		];

		Object.keys(numberOfPaxes).forEach((key) => {
			const numberOfPax = numberOfPaxes[key as keyof typeof numberOfPaxes];

			for (let i = 0; i < (key === 'adult' ? numberOfPax - 1 : numberOfPax); i++) {
				travelers.push({
					...defaultTraveler,
					ageGroup: key,
					alias: `${capitalizeEachWord(key)} ${i + 1}`
				});
			}
		});

		return travelers;
	}

	function saveAsDraft() {
		toast.success('Draft saved successfully');
	}

	onMount(() => {
		const type = page.url.searchParams.get('type');
		if (type === 'group') {
			formData.update((data) => {
				data.type = type;
				return data;
			});
		} else {
			// Initialize travelers
			formData.update((data) => {
				data.travelers = generateTravelers();
				return data;
			});
		}
	});

	return {
		state,
		form,
		formData,
		errors,
		enhance,
		handleSubmit,
		saveAsDraft
	};
}
