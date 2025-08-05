import type { SuperFormData } from 'sveltekit-superforms/client';
import type { z } from 'zod';
import type { bookingSchema } from '../page/schema';
import { onMount } from 'svelte';
import type { SeatColumn, SeatMapSegment } from '$lib/types/api/flight/ancillary/SeatMap';
import { formatThousand } from '$lib/helpers/number-helper';
import { ancillaryService } from '$lib/services/flight/ancillaryService';
import type { SeatSelectDialogState } from './types';

export function useSeatSelectDialog(formData: SuperFormData<z.infer<typeof bookingSchema>>) {
	const state = $state<SeatSelectDialogState>({
		seatMapSegments: [],
		selectedPassengerIdx: 0,
		selectedSegment: {} as SeatMapSegment
	});

	let _formDataValue = $state<z.infer<typeof bookingSchema>>();

	function getSegmentOptions() {
		const options: SeatMapSegment[][] = [];

		state.seatMapSegments.forEach((segment) => {
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

	function getSelectedSeats() {
		return (
			_formDataValue?.ancillary.seats.filter(
				(item) =>
					item.tripIndex === state.selectedSegment.TripIndex &&
					item.segmentIndex === state.selectedSegment.SegmentIndex
			) ?? []
		);
	}

	function getTotalPriceSelectedSeat() {
		const seats = _formDataValue?.ancillary.seats ?? [];
		const total = seats.reduce((sum, item) => {
			return (sum += item.seatPrice);
		}, 0);
		return seats.length > 0 ? `${formatThousand(total)} ${seats[0].seatCurrencyCode}` : '';
	}

	async function fetchSeatMapData() {
		const data = await ancillaryService.getSeatMap();

		state.seatMapSegments = data;
		state.selectedSegment = data[0];
	}

	function onSeatSelect(seat: SeatColumn) {
		const selectedSeatIdx =
			_formDataValue?.ancillary.seats.findIndex(
				(item) =>
					item.passengerIdx === state.selectedPassengerIdx &&
					item.tripIndex === state.selectedSegment.TripIndex &&
					item.segmentIndex === state.selectedSegment.SegmentIndex
			) ?? -1;

		const seatData = {
			tripIndex: state.selectedSegment?.TripIndex!,
			segmentIndex: state.selectedSegment?.SegmentIndex!,
			seatNumber: seat.SeatNumber,
			seatId: seat.SeatCode,
			seatPrice: seat.PriceAdult!,
			seatCurrencyCode: seat.Currency,
			passengerIdx: state.selectedPassengerIdx
		};

		formData.update((data) => {
			if (selectedSeatIdx === -1) {
				data.ancillary.seats = [...data.ancillary.seats, seatData];
			} else {
				data.ancillary.seats[selectedSeatIdx] = seatData;
			}

			return data;
		});

		if (state.selectedPassengerIdx < getPassengers().length - 1) {
			state.selectedPassengerIdx += 1;
		}
	}

	function getSelectedPassengerSeat(passengerIdx: number) {
		const selectedSeat = _formDataValue?.ancillary.seats.find(
			(item) =>
				item.passengerIdx === passengerIdx &&
				item.tripIndex === state.selectedSegment.TripIndex &&
				item.segmentIndex === state.selectedSegment.SegmentIndex
		);

		return selectedSeat;
	}

	function resetSeatSelection() {
		formData.update((data) => {
			data.ancillary.seats = [];

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
		fetchSeatMapData();
	});

	return {
		state,
		getSegmentOptions,
		getPassengers,
		getSelectedSeats,
		getTotalPriceSelectedSeat,
		onSeatSelect,
		getSelectedPassengerSeat,
		resetSeatSelection
	};
}
