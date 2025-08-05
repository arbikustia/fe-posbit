<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { displayTime } from '$lib/helpers/date-helper';
	import { displayCount } from '$lib/helpers/number-helper';
	import clsx from 'clsx';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { useFilterTime } from './filter-time.svelte.js';
	import type { FilterTimeProps } from './types';

	let { currentScheduleIdx }: FilterTimeProps = $props();

	const {
		state,
		toggleSelectionDepartureTime,
		toggleSelectionArrivalTime,
		onDone,
		onReset,
		getSelectedCount,
		getAppliedFilterCount,
		filterByTimes,
		filterDepartureTimeOptions,
		filterArrivalTimeOptions
	} = useFilterTime();

	const selectedCount = $derived(getSelectedCount());
	const appliedFilterCount = $derived(getAppliedFilterCount(currentScheduleIdx));

	$effect(() => {
		state.selectedDepartureTimes =
			$filterByTimes[currentScheduleIdx]?.departure?.map((item) => item.key) ?? [];
		state.selectedArrivalTimes =
			$filterByTimes[currentScheduleIdx]?.arrival?.map((item) => item.key) ?? [];
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
				Time {displayCount(appliedFilterCount)}
				<ChevronDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-fit p-4" align="start">
		<div class="flex flex-col gap-4">
			<section>
				<h3 class="mb-3 text-base font-semibold">Departure Time</h3>
				<div class="custom-scrollbar grid max-h-80 grid-cols-2 gap-4 overflow-auto px-2 py-1">
					{#each $filterDepartureTimeOptions[currentScheduleIdx] as { key, title, from, to, disabled }}
						{@const selected = state.selectedDepartureTimes.includes(key)}
						<Button
							variant="outline"
							role="checkbox"
							aria-checked={selected}
							class={clsx('h-fit px-2 focus-visible:outline-hidden', {
								'ring-2 ring-primary': selected
							})}
							onclick={() => toggleSelectionDepartureTime(key)}
							{disabled}
						>
							<div class="flex gap-x-2 text-left">
								<Checkbox checked={selected} />
								<div class="flex flex-col gap-y-1">
									<Label class="cursor-pointer text-sm leading-none text-gray-600">
										{title}
									</Label>
									<p class="0">
										{displayTime({ hour: from, minute: 0 })} - {displayTime({
											hour: to,
											minute: 0
										})}
									</p>
								</div>
							</div>
						</Button>
					{/each}
				</div>
			</section>
			<Separator />
			<section>
				<h3 class="mb-3 text-base font-semibold">Arrival Time</h3>
				<div class="custom-scrollbar grid max-h-80 grid-cols-2 gap-4 overflow-auto px-2 py-1">
					{#each $filterArrivalTimeOptions[currentScheduleIdx] as { key, title, from, to, disabled }}
						{@const selected = state.selectedArrivalTimes.includes(key)}
						<Button
							variant="outline"
							role="checkbox"
							aria-checked={selected}
							class={clsx('h-fit px-2 focus-visible:outline-hidden', {
								'ring-2 ring-primary': selected
							})}
							onclick={() => toggleSelectionArrivalTime(key)}
							{disabled}
						>
							<div class="flex gap-x-2 text-left">
								<Checkbox checked={selected} />
								<div class="flex flex-col gap-y-1">
									<Label class="cursor-pointer text-sm leading-none text-gray-600">
										{title}
									</Label>
									<p class="0">
										{displayTime({ hour: from, minute: 0 })} - {displayTime({
											hour: to,
											minute: 0
										})}
									</p>
								</div>
							</div>
						</Button>
					{/each}
				</div>
			</section>
		</div>
		<div class="mt-6 flex justify-between pr-3">
			<Button variant="ghost" onclick={onReset}>Reset</Button>
			<Button onclick={() => onDone(currentScheduleIdx)}>Done {displayCount(selectedCount)}</Button>
		</div>
	</Popover.Content>
</Popover.Root>
