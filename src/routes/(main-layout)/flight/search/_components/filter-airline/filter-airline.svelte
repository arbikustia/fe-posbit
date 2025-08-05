<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { displayCount } from '$lib/helpers/number-helper';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { FilterAirlineProps } from './types';
	import { useFilterAirline } from './filter-airline.svelte.js';

	let { currentScheduleIdx = 0 }: FilterAirlineProps = $props();

	const { state, toggleSelection, onDone, onReset, filterByAirlines, filterAirlineOptions } =
		useFilterAirline();

	$effect(() => {
		state.selectedValues = $filterByAirlines[currentScheduleIdx] ?? [];
	});
</script>

<Popover.Root bind:open={state.open}>
	<Popover.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class=" justify-between"
				{...props}
				role="combobox"
				aria-expanded={state.open}
				title="Sort"
			>
				Airlines {displayCount($filterByAirlines[currentScheduleIdx]?.length)}
				<ChevronDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-fit p-4" align="start">
		<h3 class="mb-3 text-base font-semibold">Airline</h3>
		<div class="custom-scrollbar grid max-h-80 grid-cols-2 gap-4 overflow-auto px-2">
			{#each $filterAirlineOptions[currentScheduleIdx] as { name, code, image, lowestFare, currencyCode }}
				<button
					role="checkbox"
					aria-checked={state.selectedValues.includes(code)}
					class="flex items-center justify-center gap-4 text-left focus-visible:outline-hidden"
					onclick={() => toggleSelection(code)}
				>
					<Checkbox checked={state.selectedValues.includes(code)} />
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
				</button>
			{/each}
		</div>
		<div class="mt-6 flex justify-between pr-3">
			<Button onclick={onReset} variant="ghost">Reset</Button>
			<Button onclick={() => onDone(currentScheduleIdx)}
				>Done {displayCount(state.selectedValues.length)}</Button
			>
		</div>
	</Popover.Content>
</Popover.Root>
