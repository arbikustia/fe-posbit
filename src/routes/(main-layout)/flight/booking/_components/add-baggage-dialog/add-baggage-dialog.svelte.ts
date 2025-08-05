import type { SuperFormData } from 'sveltekit-superforms/client';
import type { z } from 'zod';
import type { bookingSchema } from '../page/schema';
import type { Baggage, BaggageItem } from '$lib/types/api/flight/ancillary/Baggage';
import { formatThousand } from '$lib/helpers/number-helper';
import { onMount } from 'svelte';
import { ancillaryService } from '$lib/services/flight/ancillaryService';
import type { AddBaggageDialogState } from './types';

export function useAddBaggageDialog(formData: SuperFormData<z.infer<typeof bookingSchema>>) {
	const state = $state<AddBaggageDialogState>({
		selectedTripIndex: 0,
		availableBaggageOptions: []
	});

	let _formDataValue = $state<z.infer<typeof bookingSchema>>();

	function groupBaggageByTrip(baggages: Baggage[]): Baggage[] {
		const groupedByTrip: Record<
			number,
			{
				tripIndex: number;
				segmentIndex: number;
				origin: string;
				destination: string;
				items: Record<string, BaggageItem>;
			}
		> = {};

		for (const baggage of baggages) {
			const tripIndex = baggage.TripIndex;

			if (!groupedByTrip[tripIndex]) {
				groupedByTrip[tripIndex] = {
					tripIndex,
					segmentIndex: baggage.SegmentIndex,
					origin: baggage.Origin,
					destination: baggage.Destination,
					items: {}
				};
			}

			if (baggage.SegmentIndex > groupedByTrip[tripIndex].segmentIndex) {
				groupedByTrip[tripIndex].destination = baggage.Destination;
			}

			for (const item of baggage.Items) {
				const existingItem = groupedByTrip[tripIndex].items[item.Code];
				if (!existingItem) {
					groupedByTrip[tripIndex].items[item.Code] = { ...item };
				} else {
					existingItem.Amount += item.Amount;
				}
			}
		}

		return Object.values(groupedByTrip).map((group) => ({
			TripIndex: group.tripIndex,
			SegmentIndex: group.segmentIndex,
			Origin: group.origin,
			Destination: group.destination,
			Items: Object.values(group.items)
		}));
	}

	function handleFlightSelection(tripIndex: number) {
		state.selectedTripIndex = tripIndex;
	}

	async function fetchBaggageOptions() {
		const response = await ancillaryService.getAll();
		state.availableBaggageOptions = groupBaggageByTrip(response.Baggages);
	}

	function selectBaggage(
		passengerIdx: number,
		baggageItem: BaggageItem,
		selectedTripIndex?: number
	) {
		const tripIndex = selectedTripIndex ?? state.selectedTripIndex;

		if (_formDataValue) {
			const selectedIndex = _formDataValue.ancillary.baggages.findIndex(
				(item) => item.passengerIdx === passengerIdx && item.tripIndex === tripIndex
			);

			const baggageData = {
				baggageId: baggageItem.Code,
				baggageName: baggageItem.Quantity,
				tripIndex: tripIndex,
				baggagePrice: baggageItem.Amount,
				baggageCurrencyCode: baggageItem.CurrencyCode,
				passengerIdx: passengerIdx
			};

			formData.update((data) => {
				if (selectedIndex === -1) {
					data.ancillary.baggages = [...data.ancillary.baggages, baggageData];
				} else {
					data.ancillary.baggages[selectedIndex] = baggageData;
				}

				return data;
			});
		}
	}

	function getSelectedBaggageForTrip(tripIndex: number) {
		const selectedBaggages =
			_formDataValue?.ancillary.baggages
				.filter((item) => item.tripIndex === tripIndex)
				.map((item) => item.baggageName) ?? [];

		return selectedBaggages.length > 0 ? selectedBaggages.join(', ') : 'No Selected';
	}

	function calculateTripBaggageTotal(tripIndex: number) {
		const baggages =
			_formDataValue?.ancillary.baggages.filter((item) => item.tripIndex === tripIndex) ?? [];
		const totalPrice = baggages.reduce((sum, item) => {
			return sum + item.baggagePrice;
		}, 0);

		return totalPrice > 0
			? `${formatThousand(totalPrice)} ${baggages[0]?.baggageCurrencyCode}`
			: '';
	}

	function calculateTotalPrice() {
		const totalPrice =
			_formDataValue?.ancillary.baggages.reduce((sum, item) => {
				return sum + item.baggagePrice;
			}, 0) ?? 0;

		return `${formatThousand(totalPrice)} ${state.availableBaggageOptions[0]?.Items[0]?.CurrencyCode}`;
	}

	function resetBaggageSelection() {
		formData.update((data) => {
			data.ancillary.baggages = [];

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
		fetchBaggageOptions();
	});

	return {
		state,
		handleFlightSelection,
		selectBaggage,
		getSelectedBaggageForTrip,
		calculateTripBaggageTotal,
		calculateTotalPrice,
		resetBaggageSelection
	};
}
