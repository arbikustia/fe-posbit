<script lang="ts">
	import { Flight } from '$lib/components/icons';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { getPassengerFullName } from '../page/helpers';
	import { useFlightAncillaryMealSummary } from './flight-ancillary-meal-summary.svelte.js';
	import type { FlightAncillaryMealSummaryProps } from './types';

	let { meals, passengers, trips }: FlightAncillaryMealSummaryProps = $props();

	const { getAllMealTotalPrice, getPassengerIdxsBySegment } = useFlightAncillaryMealSummary();
</script>

{#if meals.length > 0}
	<div
		class={cn('mt-4 flex gap-4', {
			'flex-col': trips.length > 2
		})}
	>
		{#each trips as trip, tripIndex}
			{@const tripMeals = meals.filter((item) => item.tripIndex === tripIndex)}
			{#if tripMeals.length > 0}
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
						{@const mealSegments = tripMeals.filter(
							(item) => item.segmentIndex === tripSegmentIndex
						)}
						{@const passengerIdxs = getPassengerIdxsBySegment(mealSegments)}
						{#if mealSegments.length > 0}
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
								{#each passengerIdxs as passengerIdx}
									{@const passengerMeals = mealSegments.filter(
										(item) => item.passengerIdx === passengerIdx
									)}
									<div class="space-y-1">
										<div class="font-semibold">
											{getPassengerFullName(passengers[passengerIdx])}
										</div>
										{#each passengerMeals as passengerMeal}
											<div
												class="flex flex-nowrap items-center justify-between gap-x-4 pl-4 text-sm text-gray-500"
											>
												<div class="line-clamp-1 flex-1">
													{passengerMeal.mealName}
												</div>
												<div>
													{formatThousand(passengerMeal.mealPrice)}
													{passengerMeal.mealCurrencyCode}
												</div>
											</div>
										{/each}
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
		<p>{getAllMealTotalPrice(meals)}</p>
	</div>
{/if}
