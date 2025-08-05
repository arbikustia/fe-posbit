<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { useFlightAncillarySeatSummary } from './flight-ancillary-seat-summary.svelte.js';
	import type { FlightAncillarySeatSummaryProps } from './types';

	let { seats, trips }: Pick<FlightAncillarySeatSummaryProps, 'seats' | 'trips'> = $props();

	const {
		getAllSeatTotalPrice,
		getSeatNames,
		getSeatSegmentTotalPrice,
		groupSeatsByTripAndSegment
	} = useFlightAncillarySeatSummary();

	const seatsByTripAndSegment = $derived(groupSeatsByTripAndSegment(seats));
</script>

{#if seats.length > 0}
	<div class="mt-4 space-y-2 px-2">
		{#each seatsByTripAndSegment as seatByTripAndSegment, seatByTripAndSegmentIndex}
			{@const tripIndex = seatByTripAndSegment[0].tripIndex}
			{@const segmentIndex = seatByTripAndSegment[0].segmentIndex}
			{@const segment = trips[tripIndex].segments[segmentIndex]}
			{@const isLast = seatByTripAndSegmentIndex === seatsByTripAndSegment.length - 1}
			<div class="grid w-full grid-cols-3 items-center gap-2 text-sm">
				<div>
					<img
						class="h-6 w-6 object-contain"
						src={segment.marketingCarrier.image}
						alt="Airplane Logo"
					/>
					<p class="text-xs">
						{segment.origin.airport.code} - {segment.destination.airport.code}
					</p>
				</div>

				<p>{getSeatNames(seatByTripAndSegment)}</p>
				<p class="text-right">{getSeatSegmentTotalPrice(seatByTripAndSegment)}</p>
			</div>
			{#if !isLast}
				<Separator />
			{/if}
		{/each}
	</div>
	<div class="mt-4 flex justify-end gap-4 px-2 text-sm">
		<p class="font-semibold">Subtotal</p>
		<p>{getAllSeatTotalPrice(seats)}</p>
	</div>
{/if}
