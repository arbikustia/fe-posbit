<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
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
	<div class="px-2">
		<div class={cn('mt-4 flex flex-col items-center gap-2')}>
			{#each baggagesByTrips as baggagesByTrip, baggagesByTripIndex}
				{@const tripIndex = baggagesByTrip[0].tripIndex}
				{@const trip = trips[tripIndex]}
				{@const isLast = baggagesByTripIndex === baggagesByTrips.length - 1}
				<div class="grid w-full grid-cols-3 items-center gap-2 text-sm">
					<div>
						<img
							class="h-6 w-6 object-contain"
							src={trip.platingCarrier.image}
							alt="Airplane Logo"
						/>
						<p class="text-xs">
							{trip.origin.airport.code} - {trip.destination.airport.code}
						</p>
					</div>

					<p>{getTripBaggageNames(baggagesByTrip)}</p>
					<p class="text-right">{getTripBaggageTotalPrice(baggagesByTrip)}</p>
				</div>
				{#if !isLast}
					<Separator />
				{/if}
			{/each}
		</div>
		<div class="mt-4 flex justify-end gap-4 text-sm">
			<p class="font-semibold">Subtotal</p>
			<p>{getAllBaggageTotalPrice(baggages)}</p>
		</div>
	</div>
{/if}
