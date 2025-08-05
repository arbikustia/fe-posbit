<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Funnel } from '@lucide/svelte';
	import { SearchForm } from '../../../_components/search-form';
	import { DateSelector } from '../date-selector';
	import { FilterClass } from '../filter-class';
	import { FilterTime } from '../filter-time';
	import { FilterTrain } from '../filter-Train';
	import { TrainSort } from '../train-sort';
	import { fly, slide } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card';
	import { Accordion } from 'bits-ui';
	import { flip } from 'svelte/animate';
	import { TrainCard } from '../train-card';
	import { TripSummary } from '../../../_components/trip-summary';
	import { FareDetail } from '../../../_components/fare-detail';
	import { TripSelectionSummary } from '../trip-selection-summary';
	import { ShareSchedule } from '../share-schedule';
	import {
		ListViewModeToggle,
		type ListViewMode
	} from '../../../../(component)/list-view-mode-toggle';
	import { TrainTableRow } from '../train-table-row';
	import { cn } from '$lib/utils';

	let isOpenSelectionSummary = $state(false);
	let listViewMode = $state<ListViewMode>('list');
</script>

<svelte:head>
	<title>Train Booking</title>
</svelte:head>

<div class="relative">
	<SearchForm variant="sticky" />

	<div class="container">
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-8 space-y-5">
				<div class="mb-4 flex items-end justify-between">
					<div class="flex items-center gap-3">
						<div
							class="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-center font-medium"
						>
							1
						</div>
						<div>
							<div class="flex items-center">
								<div class="text-lg font-semibold">Select Departure Train</div>
							</div>
							<div class="text-muted-foreground flex text-sm">
								<div>Gambir (GMR) → Bandung (BD)</div>
							</div>
						</div>
					</div>
					<div>
						<ListViewModeToggle bind:value={listViewMode} />
					</div>
				</div>
				<div class="bg-primary/5 rounded-lg px-16 py-2 shadow-sm">
					<DateSelector />
				</div>
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Funnel class="text-gray-400" />
						<FilterTime />
						<FilterClass />
						<FilterTrain />
						<Button variant="ghost">Clear</Button>
					</div>

					<div class="flex items-center gap-2">
						<ShareSchedule />
						<TrainSort />
					</div>
				</div>

				{#if listViewMode === 'table'}
					{@const thClass = 'bg-primary py-2 pr-4 text-white'}
					<div in:fly={{ y: -50 }}>
						<Card.Root class="py-0">
							<Card.Content class="px-0">
								<table class="w-full rounded-xl">
									<thead>
										<tr>
											<th class={cn(thClass, 'rounded-tl-md pl-2')}>Train</th>
											<th class={thClass}>Number</th>
											<th class={thClass}>Depart</th>
											<th class={thClass}>Arrive</th>
											<th class={thClass}>Duration</th>
											<th class={thClass}>Price and Class</th>
											<th class={cn(thClass, 'rounded-tr-md')}>Select</th>
										</tr>
									</thead>
									{#each Array(15) as item, i (i)}
										<tbody animate:flip={{ duration: 300 }}>
											<TrainTableRow isLast={i === 14} />
										</tbody>
									{/each}
								</table>
							</Card.Content>
						</Card.Root>
					</div>
				{:else}
					<div in:fly={{ y: -50 }}>
						<Card.Root class="overflow-hidden py-0">
							<Card.Content class="p-0">
								<Accordion.Root type="single">
									{#each Array(15) as item, i (i)}
										<div animate:flip={{ duration: 300 }} transition:slide>
											<TrainCard onclick={() => (isOpenSelectionSummary = true)} />
										</div>
									{/each}
								</Accordion.Root>
							</Card.Content>
						</Card.Root>
					</div>
				{/if}
			</div>

			<div class="col-span-4">
				<div class="sticky top-28 space-y-4">
					<div transition:slide>
						<TripSummary />
					</div>
					<div transition:slide>
						<FareDetail />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<TripSelectionSummary bind:open={isOpenSelectionSummary} />
