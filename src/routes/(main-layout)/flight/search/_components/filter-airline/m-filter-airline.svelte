<script lang="ts">
	import { Flight } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Label from '$lib/components/ui/label/label.svelte';
	import { displayCount, formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { useFilterAirline } from './filter-airline.svelte.js';
	import type { FilterAirlineProps } from './types';

	let { currentScheduleIdx = 0 }: FilterAirlineProps = $props();

	const { state, toggleSelection, onDone, onReset, filterByAirlines, filterAirlineOptions } =
		useFilterAirline();

	$effect(() => {
		state.selectedValues = $filterByAirlines[currentScheduleIdx] ?? [];
	});
</script>

<Drawer.Root bind:open={state.open}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={cn('flex w-full items-center justify-center border-r text-xs', {
			'text-primary': $filterByAirlines[currentScheduleIdx]?.length > 0
		})}
	>
		<div class="relative flex flex-col items-center justify-center">
			<Flight class="h-4 w-4" />
			Airline {displayCount($filterByAirlines[currentScheduleIdx]?.length)}
			<!-- {#if $filterByAirlines[currentScheduleIdx]?.length > 0}
				<Badge
					class="absolute -right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[8px]"
					>{$filterByAirlines[currentScheduleIdx]?.length}0</Badge
				>
			{/if} -->
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Airline</Drawer.Title>
		</Drawer.Header>
		<div class="relative h-[50lvh] space-y-2 overflow-y-auto px-4 pb-24 pt-4">
			{#each $filterAirlineOptions[currentScheduleIdx] as { name, code, image, lowestFare, currencyCode }}
				<button
					role="checkbox"
					aria-checked={state.selectedValues.includes(code)}
					class="focus-visible:outline-hidden flex w-full items-center justify-between gap-4 text-left"
					onclick={() => toggleSelection(code)}
				>
					<div class="flex items-center gap-2">
						<img class="h-[32px] w-[32px] object-contain" src={image} alt={`${name} Logo`} />
						<div>
							<Label class="cursor-pointer">{name}</Label>
							<p class="text-xs text-gray-400">
								{formatThousand(lowestFare)}
								{currencyCode}
							</p>
						</div>
					</div>
					<Checkbox checked={state.selectedValues.includes(code)} />
				</button>
			{/each}
			<div
				class="fixed bottom-0 left-0 right-0 z-10 mt-6 flex justify-between gap-2 bg-white px-3 py-4"
			>
				<Button class="flex-1" onclick={onReset} variant="secondary">Reset</Button>
				<Button class="flex-1" onclick={() => onDone(currentScheduleIdx)}
					>Done {displayCount(state.selectedValues.length)}</Button
				>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
