import { bookingService } from '$lib/services/flight/bookingService';
import type { Booking } from '$lib/types/api/flight/booking/Booking';
import { onMount } from 'svelte';

type FlightReservationDetailPageState = {
	booking: Booking | null;
	isLoading: boolean;
};

export function useFlightReservationDetailPage() {
	const state = $state<FlightReservationDetailPageState>({
		booking: null,
		isLoading: true
	});

	async function fetchBooking() {
		try {
			const response = await bookingService.getDetail();
			state.booking = response;
		} catch (error) {
			console.error('Error fetching booking details:', error);
		} finally {
			state.isLoading = false;
		}
	}

	function getFlightType() {
		const pnrsLength = state.booking?.pnrs.length ?? 0;
		const flightLength = state.booking?.pnrs[0].flights.length ?? 0;
		if (pnrsLength > 2 || flightLength > 2) {
			return 'multicity';
		}

		if (pnrsLength === 2 || flightLength === 2) {
			return 'roundtrip';
		}

		return 'oneway';
	}

	function getFlightTypeLabel() {
		const flightType = getFlightType();

		if (flightType === 'roundtrip') {
			return 'Round Trip';
		}

		if (flightType === 'multicity') {
			return 'Multi City';
		}

		return 'One Way';
	}

	onMount(() => {
		fetchBooking();
	});

	return {
		state,
		getFlightTypeLabel,
		getFlightType
	};
}
