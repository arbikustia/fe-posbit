<script lang="ts">
	import type { Trip } from '$lib/types/FlightResponse';
	import { MFlightDetailDialog } from '../../../_components/flight-detail-dialog';
	import {
		FlightSummarySegmentLabel,
		FlightSummaryTripCard
	} from '../../../_components/flight-summary';

	type MBookingFlightSummaryItemProps = {
		trip: Trip;
		number: number;
	};

	let { trip, number }: MBookingFlightSummaryItemProps = $props();

	let isDetailOpen = $state(false);
</script>

<div class="space-y-2">
	<FlightSummarySegmentLabel
		label={number}
		showDetailAction
		onDetailActionClick={() => (isDetailOpen = true)}
		dateTime={trip.departureDateTime}
	/>
	<FlightSummaryTripCard {trip} />
</div>

<MFlightDetailDialog bind:isOpen={isDetailOpen} {trip} classId={trip.classes[0].uniqueId} />
