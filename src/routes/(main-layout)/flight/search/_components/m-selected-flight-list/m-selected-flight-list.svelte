<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { displayDate, displayTime } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	import type { FlightClass, Trip } from '$lib/types/FlightResponse';
	import { cn } from '$lib/utils';
	import { Slice } from '@lucide/svelte';

	type SummaryCardProps = {
		currentSelectionIdx?: number;
		trips: Trip[];
		flightClasses: FlightClass[];
		onChangeFlight?: (idx: number) => void;
	};

	let { trips, flightClasses, onChangeFlight }: SummaryCardProps = $props();
</script>

{#snippet flightItem({
	trip,
	flightClass,
	idx
}: {
	trip: Trip;
	flightClass: FlightClass;
	idx: number;
	onChangeFlight: SummaryCardProps['onChangeFlight'];
})}
	<div class="grid grid-cols-12 items-center gap-2">
		<div class="col-span-6">
			<div class=" flex items-center gap-2">
				<div
					class={cn(
						'bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md text-center text-sm font-semibold'
					)}
				>
					{idx + 1}
				</div>

				<div class="text-xs">
					<div class="font-semibold">
						{trip.platingCarrier.name} ∙ {trip.origin.airport.code} → {trip.destination.airport
							.code}
					</div>
					<div>
						{displayDate(trip.departureDateTime, 'DD MMM YYYY')} ∙ {displayTime(
							trip.departureDateTime
						)} - {displayTime(trip.arrivalDateTime)}
					</div>
				</div>
			</div>
		</div>
		<div class="col-span-4 text-right text-xs">
			{formatThousand(flightClass.fare.total)}
			{flightClass.fare.currency}
		</div>
		<div class="col-span-2 text-right">
			<Button
				variant="link"
				class="h-fit p-0 hover:no-underline"
				onclick={() => onChangeFlight?.(idx)}>Change</Button
			>
		</div>
	</div>
{/snippet}

<Card.Root class="rounded-none py-0">
	<Card.CardContent class="p-2">
		<div class="space-y-2">
			{#each flightClasses.length > 1 ? flightClasses.slice(0, -1) : flightClasses as flighClass, i}
				{@render flightItem({
					trip: trips[i],
					flightClass: flighClass,
					idx: i,
					onChangeFlight: onChangeFlight
				})}
			{/each}
		</div>
	</Card.CardContent>
</Card.Root>
