<script lang="ts">
	import { AirplaneTime } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Label from '$lib/components/ui/label/label.svelte';
	import { displayTime } from '$lib/helpers/date-helper';
	import { displayCount } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils.js';
	import clsx from 'clsx';
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

<Drawer.Root bind:open={state.open}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={cn('flex w-full items-center justify-center border-r text-xs', {
			'text-primary': appliedFilterCount > 0
		})}
	>
		<div class="relative flex flex-col items-center justify-center">
			<AirplaneTime class="h-4 w-4" />
			Time {displayCount(appliedFilterCount)}
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
			<Drawer.Title>Time</Drawer.Title>
		</Drawer.Header>
		<div class="relative flex h-[50lvh] flex-col gap-4 overflow-auto px-4 pb-12">
			<section>
				<h3 class="mb-3 text-base font-semibold">Departure Time</h3>
				<div class="grid grid-cols-2 gap-4">
					{#each $filterDepartureTimeOptions[currentScheduleIdx] as { key, title, from, to, disabled }}
						{@const selected = state.selectedDepartureTimes.includes(key)}
						<Button
							variant="outline"
							role="checkbox"
							aria-checked={selected}
							class={clsx('focus-visible:outline-hidden h-fit px-2', {
								'ring-primary ring-2': selected
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
			<section>
				<h3 class="mb-3 text-base font-semibold">Arrival Time</h3>
				<div class="grid grid-cols-2 gap-4">
					{#each $filterArrivalTimeOptions[currentScheduleIdx] as { key, title, from, to, disabled }}
						{@const selected = state.selectedArrivalTimes.includes(key)}
						<Button
							variant="outline"
							role="checkbox"
							aria-checked={selected}
							class={clsx('focus-visible:outline-hidden h-fit px-2', {
								'ring-primary ring-2': selected
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
			<div
				class="fixed bottom-0 left-0 right-0 z-10 mt-6 flex justify-between gap-2 bg-white px-3 py-4"
			>
				<Button class="flex-1" onclick={onReset} variant="secondary">Reset</Button>
				<Button class="flex-1" onclick={() => onDone(currentScheduleIdx)}
					>Done {displayCount(selectedCount)}</Button
				>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
