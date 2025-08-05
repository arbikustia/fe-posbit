import type { SuperFormData } from 'sveltekit-superforms/client';
import type { z } from 'zod';
import type { bookingSchema } from '../page/schema';
import { onMount } from 'svelte';
import { formatThousand } from '$lib/helpers/number-helper';
import { ancillaryService } from '$lib/services/flight/ancillaryService';
import type { AddMealDialogState } from './types';
import type { Meal, MealItem } from '$lib/types/api/flight/ancillary/Meal';
import type { Trip } from '$lib/types/FlightResponse';

export function useAddMealDialog(formData: SuperFormData<z.infer<typeof bookingSchema>>) {
	const state = $state<AddMealDialogState>({
		mealSegments: [],
		selectedPassengerIdx: 0,
		selectedSegment: {} as Meal,
		showLimitError: false
	});

	let _formDataValue = $state<z.infer<typeof bookingSchema>>();

	function groupSegmentsByTrip() {
		const options: Meal[][] = [];

		state.mealSegments.forEach((segment) => {
			const index = segment.TripIndex;
			if (!options[index]) {
				options[index] = [];
			}
			options[index].push(segment);
		});

		return options;
	}

	function getPassengers() {
		return _formDataValue?.passengers.filter((item) => item.ageGroup !== 'infant') ?? [];
	}

	function getCurrentTripSegment(trips: Trip[]) {
		if (state.selectedSegment.TripIndex !== undefined) {
			return trips[state.selectedSegment.TripIndex].segments[state.selectedSegment.SegmentIndex];
		}
	}

	function getTotalPriceSelectedMeal() {
		const meals = _formDataValue?.ancillary.meals ?? [];
		const total = meals.reduce((sum, item) => {
			return (sum += item.mealPrice);
		}, 0);
		return meals.length > 0 ? `${formatThousand(total)} ${meals[0].mealCurrencyCode}` : '';
	}

	async function fetchMealData() {
		const data = await ancillaryService.getAll();

		state.mealSegments = data.Meals;
		state.selectedSegment = data.Meals[0];
	}

	function onMealSelect(mealItem: MealItem) {
		const selectedPassengerMeals =
			_formDataValue?.ancillary.meals.filter(
				(item) =>
					item.passengerIdx === state.selectedPassengerIdx &&
					item.tripIndex === state.selectedSegment.TripIndex &&
					item.segmentIndex === state.selectedSegment.SegmentIndex
			).length ?? 0;

		const selectedMeal = _formDataValue?.ancillary.meals.find(
			(item) =>
				item.passengerIdx === state.selectedPassengerIdx &&
				item.tripIndex === state.selectedSegment.TripIndex &&
				item.segmentIndex === state.selectedSegment.SegmentIndex &&
				item.mealId === mealItem.Code
		);

		const mealData = {
			tripIndex: state.selectedSegment?.TripIndex!,
			segmentIndex: state.selectedSegment?.SegmentIndex!,
			mealName: mealItem.Name,
			mealId: mealItem.Code,
			mealPrice: mealItem.Price,
			mealCurrencyCode: mealItem.CurrencyCode,
			passengerIdx: state.selectedPassengerIdx
		};

		formData.update((data) => {
			if (selectedMeal) {
				data.ancillary.meals = data.ancillary.meals.filter((item) => item.mealId !== mealItem.Code);
			} else {
				if (selectedPassengerMeals >= 3) {
					state.showLimitError = true;
					setTimeout(() => {
						state.showLimitError = false;
					}, 1000);
					return data;
				}
				data.ancillary.meals = [...data.ancillary.meals, mealData];
			}

			return data;
		});
	}

	function getSelectedPassengerMeals(passengerIdx: number) {
		const selectedMeals = _formDataValue?.ancillary.meals.filter(
			(item) =>
				item.passengerIdx === passengerIdx &&
				item.tripIndex === state.selectedSegment.TripIndex &&
				item.segmentIndex === state.selectedSegment.SegmentIndex
		);

		return selectedMeals ?? [];
	}

	function getPassengerIdxsBySegment(segment: Meal) {
		const seen = new Set();
		return (_formDataValue?.ancillary.meals ?? [])
			.filter(
				(meal) => meal.tripIndex === segment.TripIndex && meal.segmentIndex === segment.SegmentIndex
			)
			.filter((meal) => {
				if (seen.has(meal.passengerIdx)) {
					return false;
				}
				seen.add(meal.passengerIdx);
				return true;
			})
			.map((meal) => meal.passengerIdx);
	}

	function resetMealSelection() {
		formData.update((data) => {
			data.ancillary.meals = [];

			return data;
		});
	}

	$effect(() => {
		const unsubscribe = formData.subscribe((data) => {
			_formDataValue = data;
		});

		return () => unsubscribe();
	});

	onMount(() => {
		fetchMealData();
	});

	return {
		state,
		groupSegmentsByTrip,
		getPassengers,
		getTotalPriceSelectedMeal,
		getPassengerIdxsBySegment,
		getCurrentTripSegment,
		onMealSelect,
		getSelectedPassengerMeals,
		resetMealSelection
	};
}
