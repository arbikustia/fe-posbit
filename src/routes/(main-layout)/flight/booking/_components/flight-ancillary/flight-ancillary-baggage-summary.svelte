<script lang="ts">
	import { Flight } from '$lib/components/icons';
	import { cn } from '$lib/utils';
	import { useFlightAncillaryBaggageSummary } from './flight-ancillary-baggage-summary.svelte.js';
	import type { FlightAncillaryBaggageSummaryProps } from './types';

	let { baggages, trips }: FlightAncillaryBaggageSummaryProps = $props();

	const {
		getTripBaggageNames,
		getTripBaggageTotalPrice,
		getAllBaggageTotalPrice,
		mergeBaggageByTripIndex
	} = useFlightAncillaryBaggageSummary();

	const baggagesByTrips = $derived(mergeBaggageByTripIndex(baggages));
</script>

{#if baggages.length > 0}
	<div
		class={cn('mt-4 flex items-center gap-4', {
			'flex-col': trips.length > 2
		})}
	>
		{#each baggagesByTrips as baggagesByTrip}
			{@const tripIndex = baggagesByTrip[0].tripIndex}
			{@const trip = trips[tripIndex]}
			<div class="flex-1 space-y-2">
				{#if baggagesByTrips.length > 2}
					<p>Flight {tripIndex + 1}</p>
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

				<div class="space-y-2 rounded-md border p-4">
					<div class="flex items-center gap-2">
						<img
							class="h-8 w-8 object-contain"
							src={trip.platingCarrier.image}
							alt="Airplane Logo"
						/>
						<p class="font-semibold">
							{trip.origin.airport.code} - {trip.destination.airport.code}
						</p>
					</div>
					<div class="flex items-center justify-between">
						<p>{getTripBaggageNames(baggagesByTrip)}</p>
						<p>{getTripBaggageTotalPrice(baggagesByTrip)}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-4 flex justify-end gap-4 pr-4">
		<p class="font-semibold">Subtotal</p>
		<p>{getAllBaggageTotalPrice(baggages)}</p>
	</div>
{/if}
