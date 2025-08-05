<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import type { Segment } from '$lib/types/FlightResponse';

	type FlightInformationProps = {
		segments: Segment[];
		cabinClass?: string | null;
	};

	let { segments, cabinClass }: FlightInformationProps = $props();

	// const cabinClass = $derived(
	// 	trip.classes.find((cls) => cls.uniqueId === selectedClassId)?.cabinClass
	// );
</script>

{#snippet title(text: string)}
	<p class="text-base font-semibold leading-none">{text}</p>
{/snippet}

{#snippet subtitle(text: string)}
	<p class="text-sm text-gray-600">{text}</p>
{/snippet}

{#snippet scheduleInfo(time: string, date: string)}
	<div class="w-28 justify-end text-end">
		{@render title(time)}
		{@render subtitle(date)}
	</div>
{/snippet}

{#snippet airportInfo(city: string, airport: string, terminal: string)}
	<div class={'flex-1'}>
		{@render title(city)}
		{@render subtitle(airport)}
		{@render subtitle(terminal)}
	</div>
{/snippet}

<div class="space-y-6">
	{#each segments as segment}
		{#if segment.transitTime}
			<div class="flex justify-center">
				<Badge class="border-gray-400 bg-white" variant="outline"
					>{formatTimeSpan(segment.transitTime)} layover . {segment.origin.city.name} ({segment
						.origin.airport.code})</Badge
				>
			</div>
		{/if}
		<div>
			<!-- DEPARTURE -->
			<div class="flex w-fit gap-x-4">
				{@render scheduleInfo(
					displayTime(segment.departureDateTime),
					displayDate(segment.departureDateTime)
				)}
				<div class="flex w-2 flex-col items-center">
					<div class="mt-2 h-3 w-3 rounded-full border border-primary"></div>
					<div class="w-px flex-1 bg-gray-400"></div>
				</div>
				{@render airportInfo(
					`${segment.origin.city.name} (${segment.origin.airport.code})`,
					segment.origin.airport.name,
					segment.origin.airport.terminal
				)}
			</div>

			<!-- AIRPLANE -->
			<div class="flex w-fit gap-x-4">
				<div class="flex w-28 items-center justify-end py-10 text-end">
					{@render subtitle(formatTimeSpan(segment.flightTime))}
				</div>
				<div class="flex w-2 flex-col items-center">
					<div class="w-px flex-1 bg-gray-400"></div>
				</div>
				<div class="flex-1 py-10">
					<div class="flex items-center gap-3">
						<img
							class="h-8"
							src={segment.marketingCarrier.image}
							alt={`${segment.marketingCarrier.name} Logo`}
						/>
						<div>
							<p class="text-xs text-gray-600">{segment.marketingCarrier.name}</p>
							<p class="text-xs text-gray-600">
								{`${segment.marketingCarrier.code}-${segment.marketingCarrier.flightNumber}`}
								{#if cabinClass}
									{cabinClass}
								{/if}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- ARRIVAL -->
			<div class="flex w-fit gap-x-4">
				{@render scheduleInfo(
					displayTime(segment.arrivalDateTime),
					displayDate(segment.arrivalDateTime)
				)}
				<div class="flex w-2 flex-col items-center">
					<div class="h-3 w-3 rounded-full border border-primary bg-primary"></div>
				</div>
				{@render airportInfo(
					`${segment.destination.city.name} (${segment.destination.airport.code})`,
					segment.destination.airport.name,
					segment.destination.airport.terminal
				)}
			</div>
		</div>
	{/each}
</div>
