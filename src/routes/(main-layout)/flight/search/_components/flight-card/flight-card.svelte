<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as dateHelper from '$lib/helpers/date-helper';
	import { cn } from '$lib/utils';
	import { Accordion } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { FlightInformation } from '../../../_components/flight-information';
	import { FlightCardClass } from '../flight-card-class';
	import { useFlightCard } from './flight-card.svelte.js';
	import type { FlightCardProps } from './types';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';

	let { trip, onclick, onSelect, selectedFlightClassId, ...props }: FlightCardProps = $props();

	const { state, getSelectedClass, stopPropagation } = useFlightCard();

	const isSelected = $derived(getSelectedClass(selectedFlightClassId));

	$effect(() => {
		state.selectedClassId =
			trip.classes.some((cls) => selectedFlightClassId === cls.uniqueId) && !!selectedFlightClassId
				? selectedFlightClassId
				: trip.classes[0].uniqueId;
	});
</script>

<Accordion.Item
	value={trip.key}
	class={cn('cursor-pointer border-b', {
		'bg-primary/5': isSelected
	})}
	onclick={() => onclick(state.selectedClassId)}
>
	<Accordion.Header class="relative flex flex-1 gap-x-4 p-4">
		<div class="flex flex-1 items-center justify-end" {...props}>
			<!-- AIRLINE LOGO + NAME -->
			<div class="mr-auto flex items-center gap-3">
				<div class="flex-0 w-[45px]">
					<img class="max-h-[40px] max-w-[45px]" src={trip.platingCarrier.image} alt="logo" />
				</div>

				<div>
					<div class="text-sm">
						{trip.platingCarrier.name}
					</div>
				</div>
			</div>

			<!-- DEPARTURE -> ARRIVAL -->
			<div class=" mr-5 flex items-center gap-3">
				<!-- ORIGIN -->
				<div class="w-[50px] text-center leading-none">
					<div class="text-lg font-medium">{dateHelper.displayTime(trip.departureDateTime)}</div>
					<div class="text-muted-foreground">{trip.origin.airport.code}</div>
				</div>

				<!-- DURATION -->
				<div class="flex w-[100px] items-center justify-center text-center">
					<div class="w-3 border-b border-dashed border-muted-foreground"></div>
					<div class="w-[60px] text-sm text-muted-foreground">
						<div class="whitespace-nowrap">{dateHelper.formatTimeSpan(trip.travelTime)}</div>
						{#if trip.transitCount > 0}
							<div class="text-xs">{transitDisplay(trip.transitCount)}</div>
						{/if}
					</div>

					<div class="w-3 border-b border-dashed border-muted-foreground"></div>
				</div>

				<!-- DESTINATION -->
				<div class="w-[50px] text-center leading-none">
					<div class="text-lg font-medium">{dateHelper.displayTime(trip.arrivalDateTime)}</div>
					<div class="text-muted-foreground">{trip.destination.airport.code}</div>
				</div>
			</div>

			<!-- SELECT PRICE -->
			<div class="ml-4 flex items-center">
				<FlightCardClass
					bind:value={
						() => state.selectedClassId,
						(newValue) => {
							if (isSelected) {
								onclick(newValue);
							}
							return (state.selectedClassId = newValue);
						}
					}
					classList={trip.classes}
				/>

				<Button
					onclick={(e) => {
						stopPropagation(e);
						onSelect(state.selectedClassId);
					}}
					size="sm"
					class="ml-4 px-4">Select</Button
				>
			</div>
		</div>
		<Accordion.Trigger
			class="select-none text-[15px] font-medium transition-all [&[data-state=open]>svg]:rotate-180"
			onclick={stopPropagation}
		>
			<ChevronDown
				class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
			/>
		</Accordion.Trigger>

		<!-- selected indicator -->
		{#if isSelected}
			<span class="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-primary"></span>
		{/if}
	</Accordion.Header>

	<Accordion.Content class="bg-gray-100 p-8" forceMount onclick={stopPropagation}>
		{#snippet child({ props, open })}
			{@const cabinClass = trip.classes.find(
				(cls) => cls.uniqueId === state.selectedClassId
			)?.cabinClass}
			{#if open}
				<div {...props} transition:slide>
					<div class="flex justify-center">
						<div class="flex flex-col items-center gap-8" in:fly={{ x: -500, duration: 500 }}>
							<FlightInformation segments={trip.segments} {cabinClass} />
							<!-- <Badge class="border-gray-400 bg-white" variant="outline"
						>1h 50m layover . Surabaya (SUB)</Badge
					> -->
						</div>
					</div>
				</div>
			{/if}
		{/snippet}
	</Accordion.Content>
</Accordion.Item>
