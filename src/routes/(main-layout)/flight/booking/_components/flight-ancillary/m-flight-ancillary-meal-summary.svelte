<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { useFlightAncillaryMealSummary } from './flight-ancillary-meal-summary.svelte.js';
	import type { FlightAncillaryMealSummaryProps } from './types';

	let { meals, trips }: Pick<FlightAncillaryMealSummaryProps, 'meals' | 'trips'> = $props();

	const { getAllMealTotalPrice, getMealSegmentTotalPrice, groupMealsByTripSegmentPassenger } =
		useFlightAncillaryMealSummary();

	const mealsByTripSegmentPassenger = $derived(groupMealsByTripSegmentPassenger(meals));
</script>

{#if meals.length > 0}
	<div class="mt-4 space-y-2 px-2">
		{#each mealsByTripSegmentPassenger as mealByTripAndSegment, mealByTripAndSegmentIndex}
			{@const tripIndex = mealByTripAndSegment.tripIndex}
			{@const segmentIndex = mealByTripAndSegment.segmentIndex}
			{@const segment = trips[tripIndex].segments[segmentIndex]}
			{@const isLast = mealByTripAndSegmentIndex === mealsByTripSegmentPassenger.length - 1}
			<div class="flex items-center justify-between gap-2 text-sm">
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

				<p class="text-right">{getMealSegmentTotalPrice(mealByTripAndSegment.meals)}</p>
			</div>
			{#if !isLast}
				<Separator />
			{/if}
		{/each}
	</div>
	<div class="mt-4 flex justify-end gap-4 px-2 text-sm">
		<p class="font-semibold">Subtotal</p>
		<p>{getAllMealTotalPrice(meals)}</p>
	</div>
{/if}
