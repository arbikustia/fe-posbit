<script lang="ts">
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Badge } from '$lib/components/ui/badge';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	import type { FlightClass, Segment, Trip } from '$lib/types/FlightResponse';
	import type { ShareScheduleItemProps } from './types';

	let { trip, onCheck, checked }: ShareScheduleItemProps = $props();
</script>

{#snippet airplaneLogo(src: string)}
	<img class="h-6 w-6 object-contain" {src} alt="airplane logo" />
{/snippet}

{#snippet layover(segment: Segment)}
	<Badge
		class="border-gray-200 bg-white text-[10px] font-normal text-muted-foreground"
		variant="outline"
		>{formatTimeSpan(segment.transitTime)} layover . {segment.origin.city.name} ({segment.origin
			.airport.code})</Badge
	>
{/snippet}

{#snippet layoverDashline()}
	<OSGDashSeparator class="flex-1 border-b border-gray-200" />
{/snippet}

{#snippet tripTime(segment: Segment)}
	<div class="text-center text-sm">
		<p class="font-semibold">{displayTime(segment.departureDateTime)}</p>
		<p class="text-muted-foreground">{segment.origin.airport.code}</p>
	</div>
	<div class="w-10 text-center text-xs text-muted-foreground">
		{formatTimeSpan(segment.flightTime)}
	</div>
	<div class="text-center text-sm">
		<p class="font-semibold">{displayTime(segment.arrivalDateTime)}</p>
		<p class="text-muted-foreground">{segment.destination.airport.code}</p>
	</div>
{/snippet}

{#snippet classInfo(tripClass: FlightClass)}
	<p class="text-xs text-muted-foreground">{tripClass.cabinClass}</p>
	<p class="text-sm font-semibold text-primary">
		{formatThousand(tripClass.fare.total)}
		{tripClass.fare.currency}
	</p>
{/snippet}

<div class="border-b p-2">
	{#each trip.segments as segment, i}
		{@const tripClass = trip.classes[0]}
		{#if segment.transitTime}
			<div class="my-4 flex items-center">
				{@render layoverDashline()}
				{@render layover(segment)}
				{@render layoverDashline()}
			</div>
		{/if}

		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					{@render airplaneLogo(segment.marketingCarrier.image)}
					<p class="text-xs">
						{segment.marketingCarrier.name} • {segment.marketingCarrier.code}-{segment
							.marketingCarrier.flightNumber}
					</p>
				</div>
				{#if i === 0}
					<Checkbox bind:checked={() => checked, () => {}} onclick={onCheck} />
				{/if}
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					{@render tripTime(segment)}
				</div>
				<div class="text-end">
					{#if i === 0}
						{@render classInfo(tripClass)}
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
