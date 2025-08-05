<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Trip, ScheduleResult } from '$lib/types/FlightResponse';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { FlightDetailDialog } from '../flight-detail-dialog';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { cn } from '$lib/utils';
	import { OSGActiveSelectionIndicator } from '$lib/components/opsigo-ui/active-selection-indicator';
	import FlightSummaryTripCard from './flight-summary-trip-card.svelte';
	import FlightSummarySegmentLabel from './flight-summary-segment-label.svelte';
	import FlightSummaryClassDetail from './flight-summary-class-detail.svelte';

	type FlightSummaryItem = {
		trip: Trip;
		classId: string;
		idx: number;
		destination: ScheduleResult['destination'];
		origin: ScheduleResult['origin'];
		departureDateTime: ScheduleResult['departureDateTime'];
		onChangeFlight?: (idx: number) => void;
		isActive?: boolean;
		isMultiFlight?: boolean;
		isSelection?: boolean;
	};

	let isFlightDetailOpen = $state(false);

	let {
		trip,
		destination,
		origin,
		departureDateTime,
		onChangeFlight,
		idx,
		isActive = false,
		isMultiFlight = false,
		isSelection = false,
		classId
	}: FlightSummaryItem = $props();

	function handleOpenFlightDetail() {
		isFlightDetailOpen = true;
	}
</script>

{#snippet placeholder()}
	<div
		class="flex min-h-[72px] w-full items-center justify-center rounded-xl border-2 border-dashed p-3"
	>
		<div class="flex items-center gap-x-2 text-muted-foreground">
			<div class="text-right">
				<p>
					{origin.airport.code}
				</p>
				<p class="text-sm">{origin.city.name}</p>
			</div>
			<ArrowRight />
			<div class="text-left">
				<p>
					{destination.airport.code}
				</p>
				<p class="text-sm">{destination.city.name}</p>
			</div>
		</div>
	</div>
{/snippet}

{#snippet flightInfo()}
	{#if trip}
		<FlightSummaryTripCard {trip} />
		{#if isSelection}
			<div class="my-2 px-4">
				<FlightSummaryClassDetail />
			</div>
		{/if}
	{/if}
{/snippet}

<div>
	<div class="relative px-4">
		<div class="mb-4">
			<FlightSummarySegmentLabel
				label={idx + 1}
				{isActive}
				dateTime={departureDateTime}
				showDetailAction={!!trip}
				onDetailActionClick={handleOpenFlightDetail}
			/>
		</div>

		{#if trip}
			{@render flightInfo()}
		{:else}
			{@render placeholder()}
		{/if}

		<OSGActiveSelectionIndicator isActive={isActive && isSelection} />
	</div>

	{#if !!trip && isMultiFlight && !isActive && isSelection}
		<div class="px-4">
			<Button
				class="mt-2 w-full text-primary hover:text-primary"
				variant="outline"
				size="sm"
				onclick={() => onChangeFlight?.(idx)}
			>
				Change departure flight
			</Button>
		</div>
	{/if}
</div>

<FlightDetailDialog bind:isOpen={isFlightDetailOpen} {trip} {classId} flightNumber={idx + 1} />
