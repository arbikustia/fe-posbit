<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import { useFilterTransit } from './filter-transit.svelte.js';
	import { TransitConnection } from '$lib/components/icons';
	import { cn } from '$lib/utils.js';
	import { displayCount } from '$lib/helpers/number-helper.js';

	let { currentScheduleIdx = 0 } = $props();

	const {
		state,
		filterTransitOptions,
		onReset,
		onDone,
		filterByTransit,
		getFilterCount,
		getAppliedFilterCount
	} = useFilterTransit();

	const filterCount = $derived(getFilterCount());
	const appliedFilterCount = $derived(getAppliedFilterCount(currentScheduleIdx));

	$effect(() => {
		state.isDirect = !!$filterByTransit[currentScheduleIdx]?.isDirect;
		state.isSingleTransit = !!$filterByTransit[currentScheduleIdx]?.isSingleTransit;
		state.isMultipleTransit = !!$filterByTransit[currentScheduleIdx]?.isMultipleTransit;
		if ($filterByTransit[currentScheduleIdx]?.durations?.length) {
			state.transitDuration = $filterByTransit[currentScheduleIdx]?.durations;
		} else {
			state.transitDuration = [0, $filterTransitOptions.maxTransitDuration];
		}
		state.transitLocations = $filterByTransit[currentScheduleIdx]?.locations ?? [];
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
			<TransitConnection class="h-4 w-4" />
			Transit {displayCount(appliedFilterCount)}
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Transit</Drawer.Title>
		</Drawer.Header>
		<div class="relative flex h-[50lvh] flex-col gap-y-4 overflow-y-auto px-4 pb-12">
			<section>
				<h3 class="mb-3 text-base font-semibold">Transit</h3>
				<div class="flex flex-col gap-y-2">
					<div class="flex items-center gap-x-2">
						<Checkbox
							bind:checked={state.isDirect}
							id="direct-check"
							aria-labelledby="direct-check-label"
							disabled={!$filterTransitOptions.isDirect}
						/>
						<Label
							id="direct-check-label"
							for="direct-check"
							class="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Direct</Label
						>
					</div>
					<div class="flex items-center gap-x-2">
						<Checkbox
							bind:checked={state.isSingleTransit}
							id="single-transit-check"
							aria-labelledby="single-transit-check-label"
							disabled={!$filterTransitOptions.isSingleTransit}
						/>
						<Label
							id="single-transit-check-label"
							for="single-transit-check"
							class="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>1 Transit</Label
						>
					</div>
					<div class="flex items-center gap-x-2">
						<Checkbox
							bind:checked={state.isMultipleTransit}
							id="multiple-transit-check"
							aria-labelledby="multiple-transit-check-label"
							disabled={!$filterTransitOptions.isMultipleTransit}
						/>
						<Label
							id="multiple-transit-check-label"
							for="multiple-transit-check"
							class="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>2+ Transit</Label
						>
					</div>
				</div>
			</section>
			<section>
				<div class="flex justify-between">
					<h3 class="mb-3 text-base font-semibold">Transit Duration</h3>
					<span class="text-sm text-gray-600"
						>{state.transitDuration[0]}h - {state.transitDuration[1]}h</span
					>
				</div>
				<Slider
					bind:value={state.transitDuration}
					type="multiple"
					max={$filterTransitOptions.maxTransitDuration}
					min={0}
					step={1}
				/>
				<div class="mt-2 flex justify-between">
					<Label>0h</Label>
					<Label>{$filterTransitOptions.maxTransitDuration}h</Label>
				</div>
			</section>
			<section>
				<h3 class="mb-3 text-base font-semibold">Transit Location</h3>
				<div class="flex flex-col gap-y-2">
					{#each $filterTransitOptions.transitLocations as location}
						<div class="flex items-center gap-x-2">
							<Checkbox
								checked={state.transitLocations.includes(location.airportCode)}
								value={location.airportCode}
								onCheckedChange={(v) => {
									if (v) {
										state.transitLocations = [...state.transitLocations, location.airportCode];
									} else {
										state.transitLocations = state.transitLocations.filter(
											(item) => item !== location.airportCode
										);
									}
								}}
								id="transit-location"
								aria-labelledby="transit-location-label"
							/>
							<Label
								id="transit-location-label"
								for="transit-location"
								class="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>{location.airportCode} - {location.cityName}</Label
							>
						</div>
					{/each}
				</div>
				<div
					class="fixed bottom-0 left-0 right-0 z-10 mt-6 flex justify-between gap-2 bg-white px-3 py-4"
				>
					<Button class="flex-1" variant="secondary" onclick={onReset}>Reset</Button>
					<Button class="flex-1" onclick={() => onDone(currentScheduleIdx)}
						>Done {displayCount(filterCount)}</Button
					>
				</div>
			</section>
		</div>
	</Drawer.Content>
</Drawer.Root>
