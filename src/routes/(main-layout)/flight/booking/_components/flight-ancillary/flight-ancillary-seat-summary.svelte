<script lang="ts">
	import { Flight } from '$lib/components/icons';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { getPassengerFullName } from '../page/helpers';
	import { useFlightAncillarySeatSummary } from './flight-ancillary-seat-summary.svelte.js';
	import type { FlightAncillarySeatSummaryProps } from './types';

	let { seats, passengers, trips }: FlightAncillarySeatSummaryProps = $props();

	const { getAllSeatTotalPrice } = useFlightAncillarySeatSummary();
</script>

{#if seats.length > 0}
	<div
		class={cn('mt-4 flex gap-4', {
			'flex-col': trips.length > 2
		})}
	>
		{#each trips as trip, tripIndex}
			{@const tripSeats = seats.filter((item) => item.tripIndex === tripIndex)}
			{#if tripSeats.length > 0}
				<div class="flex-1 space-y-2">
					{#if trips.length > 2}
						<p>Flight {tripIndex}</p>
					{:else}
						<div class={'flex items-center gap-2 font-semibold'}>
							<Flight
								class={cn('h-5 w-5', {
									'rotate-45': tripIndex === 0,
									'-rotate-135': tripIndex === 1
								})}
							/>
							{tripIndex > 0 ? 'Return' : 'Departure'}
						</div>
					{/if}

					{#each trip.segments as tripSegment, tripSegmentIndex}
						{@const seatSegments = tripSeats.filter(
							(item) => item.segmentIndex === tripSegmentIndex
						)}
						{#if seatSegments.length > 0}
							<div class="space-y-2 rounded-md border p-4">
								<div class="flex items-center gap-2">
									<img
										class="h-8 w-8 object-contain"
										src={tripSegment.marketingCarrier.image}
										alt="Airplane Logo"
									/>
									<p class="font-semibold">
										{tripSegment.origin.airport.code} - {tripSegment.destination.airport.code}
									</p>
								</div>
								{#each seatSegments as seatSegment}
									<div class="grid grid-cols-12 text-sm">
										<div class="col-span-6">
											{getPassengerFullName(passengers[seatSegment.passengerIdx])}
										</div>
										<div class="col-span-2 font-semibold text-gray-500">
											{seatSegment.seatNumber}
										</div>
										<div class="col-span-4 text-right">
											{formatThousand(seatSegment.seatPrice)}
											{seatSegment.seatCurrencyCode}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}
	</div>
	<div class="mt-4 flex justify-end gap-4 pr-4">
		<p class="font-semibold">Subtotal</p>
		<p>{getAllSeatTotalPrice(seats)}</p>
	</div>
{/if}
