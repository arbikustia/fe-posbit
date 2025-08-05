<script lang="ts">
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { FlightCardClass } from '../flight-card-class';
	import type { FlightCardProps } from '../flight-card/types';

	type FlightRowProps = FlightCardProps & { isLast: boolean };

	let { trip, onclick, onSelect, selectedFlightClassId, isLast = false }: FlightRowProps = $props();
	const tdClass = 'pr-4 py-1';

	let selectedClassId = $state('');

	const isSelected = $derived(selectedClassId === selectedFlightClassId);

	$effect(() => {
		selectedClassId =
			trip.classes.some((cls) => selectedFlightClassId === cls.uniqueId) && !!selectedFlightClassId
				? selectedFlightClassId
				: trip.classes[0].uniqueId;
	});
</script>

{#each trip.segments as segment, i (i)}
	{#if segment.transitTime}
		<tr
			class={cn('cursor-pointer', {
				'bg-primary/10': isSelected
			})}
			onclick={() => onclick(selectedClassId)}
			transition:slide
		>
			<td colspan="5" class={cn(tdClass, 'p-0 px-2 text-center text-xs')}>
				<div class="flex items-center gap-2">
					<OSGDashSeparator class="flex-1 border-b border-gray-300" />
					<Badge
						class="text-muted-foreground border-none bg-transparent text-[10px] font-normal"
						variant="outline"
					>
						{formatTimeSpan(segment.transitTime)} layover . {segment.origin.city.name} ({segment
							.origin.airport.code})
					</Badge>
					<OSGDashSeparator class="flex-1 border-b border-gray-300" />
				</div>
			</td>
		</tr>
	{/if}
	<tr
		class={cn('cursor-pointer', {
			'border-b border-gray-300': i === trip.segments.length - 1 && !isLast,
			'bg-primary/10': isSelected
		})}
		onclick={() => onclick(selectedClassId)}
		transition:slide
	>
		<td class={cn(tdClass, 'pl-2')}>
			<img
				src={segment.marketingCarrier.image}
				alt="airplane logo"
				class="h-8 w-8 object-contain"
			/>
		</td>
		<td class={tdClass}>
			{segment.marketingCarrier.code}
			{segment.marketingCarrier.flightNumber}
		</td>
		<td class={tdClass}>
			{segment.origin.airport.code} ({displayTime(segment.departureDateTime)})
		</td>
		<td class={tdClass}>
			{segment.destination.airport.code} ({displayTime(segment.arrivalDateTime)})
		</td>
		<td class={tdClass}>{formatTimeSpan(segment.flightTime)}</td>
		{#if i === 0}
			<td
				class={cn(tdClass, 'px-2')}
				rowspan={trip.segments.length > 1 && i === 0
					? trip.segments.length + (trip.segments.length - 1)
					: 1}
			>
				<FlightCardClass
					bind:value={
						() => selectedClassId,
						(newValue) => {
							if (isSelected) {
								onclick(newValue);
							}
							return (selectedClassId = newValue);
						}
					}
					classList={trip.classes}
				/>
			</td>
		{/if}
		{#if i === 0}
			<td
				class={cn(tdClass, 'text-end font-semibold')}
				rowspan={trip.segments.length > 1 && i === 0
					? trip.segments.length + (trip.segments.length - 1)
					: 1}
			>
				<Button
					onclick={(e) => {
						e.stopPropagation();
						onSelect(selectedClassId);
					}}
					size="sm"
					class="ml-4 px-4">Select</Button
				>
			</td>
		{/if}
	</tr>
{/each}
