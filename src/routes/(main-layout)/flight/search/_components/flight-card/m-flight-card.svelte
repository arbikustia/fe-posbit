<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as dateHelper from '$lib/helpers/date-helper';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';
	import { MFlightDetailDialog } from '../../../_components/flight-detail-dialog';
	import MFlightCardClass from '../flight-card-class/m-flight-card-class.svelte';
	import { useFlightCard } from './flight-card.svelte.js';
	import type { FlightCardProps } from './types';

	let {
		trip,
		onSelect,
		selectedFlightClassId,
		mode = 'selection'
	}: FlightCardProps & { mode?: 'selection' | 'view' } = $props();

	const { state: flightCardState, getSelectedClass, stopPropagation } = useFlightCard();

	const isSelected = $derived(getSelectedClass(selectedFlightClassId));

	let isFlightDetailDialogOpen = $state(false);

	let selectedFlightDetailClassId = $state(flightCardState.selectedClassId);

	function closeFlightDetailDialog() {
		isFlightDetailDialogOpen = false;
	}

	$effect(() => {
		flightCardState.selectedClassId =
			trip.classes.some((cls) => selectedFlightClassId === cls.uniqueId) && !!selectedFlightClassId
				? selectedFlightClassId
				: trip.classes[0].uniqueId;
	});

	$effect(() => {
		if (!isFlightDetailDialogOpen) {
			selectedFlightDetailClassId = flightCardState.selectedClassId;
		}
	});
</script>

<Card.Root
	onclick={mode === 'selection' ? () => onSelect(flightCardState.selectedClassId) : undefined}
	class={cn('overflow-hidden py-0', {
		'bg-primary/5': isSelected && mode === 'selection'
	})}
>
	<Card.Content class="relative px-4 py-2">
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-x-2">
					<img
						class="h-8 w-8 object-contain object-center"
						src={trip.platingCarrier.image}
						alt="Airline Logo"
					/>
					<p class="text-sm font-semibold">{trip.platingCarrier.name}</p>
				</div>

				<button
					class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
					onclick={(e) => {
						stopPropagation(e);
						isFlightDetailDialogOpen = true;
					}}><ChevronDown class="text-primary/80 h-5 w-5" /></button
				>
			</div>
			<div class="flex flex-wrap justify-between gap-4">
				<div class="flex items-center justify-center gap-x-3">
					<div class="text-center">
						<p class="text-sm font-semibold">{dateHelper.displayTime(trip.departureDateTime)}</p>
						<p class="text-xs">{trip.origin.airport.code}</p>
					</div>
					<div class="text-center text-[10px]">
						<p>{dateHelper.formatTimeSpan(trip.travelTime)}</p>
						<Separator />
						<p class="text-gray-500">{transitDisplay(trip.transitCount)}</p>
					</div>
					<div class="text-center">
						<p class="text-sm font-semibold">{dateHelper.displayTime(trip.arrivalDateTime)}</p>
						<p class="text-xs">{trip.destination.airport.code}</p>
					</div>
				</div>
				<div class="relative flex items-center">
					<MFlightCardClass
						bind:value={
							() => flightCardState.selectedClassId,
							(newValue) => {
								if (isSelected) {
									onSelect(newValue);
								}
								return (flightCardState.selectedClassId = newValue);
							}
						}
						classList={trip.classes}
					/>
				</div>
			</div>
		</div>

		<!-- selected indicator -->
		{#if isSelected && mode === 'selection'}
			<span class="bg-primary absolute bottom-0 left-0 top-0 w-1 rounded-r-md"></span>
		{/if}
	</Card.Content>
</Card.Root>

<MFlightDetailDialog
	bind:isOpen={isFlightDetailDialogOpen}
	{trip}
	classId={selectedFlightDetailClassId}
>
	{#snippet additionalContent()}
		{#if mode === 'selection'}
			<div
				class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4"
			>
				<div class="space-y-1">
					<p class="text-sm font-semibold">Select Class</p>
					<MFlightCardClass bind:value={selectedFlightDetailClassId} classList={trip.classes} />
				</div>
				<Button
					class="px-8"
					onclick={() => {
						flightCardState.selectedClassId = selectedFlightDetailClassId;
						onSelect(flightCardState.selectedClassId);
						closeFlightDetailDialog();
					}}>Select</Button
				>
			</div>
		{/if}
	{/snippet}
</MFlightDetailDialog>
