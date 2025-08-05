<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { useFlightService } from '$lib/hooks/use-flight-service.svelte.js';
	import * as m from '$lib/paraglide/messages.js';
	import { Accordion } from 'bits-ui';
	import { flip } from 'svelte/animate';
	import { fly, slide } from 'svelte/transition';
	import { FareDetailCard } from '../../../_components/fare-detail-card';
	import { SearchForm } from '../../../_components/search-form';
	import { FilterAirline } from '../filter-airline';
	import { FilterTime } from '../filter-time';
	import { FilterTransit } from '../filter-transit';
	import { FlightCard } from '../flight-card';
	import { FlightSkeleton } from '../flight-skeleton';
	import { FlightSort } from '../flight-sort';
	import { SearchProgress } from '../search-progress';
	import { useFlightSearchPage } from './flight-search-page.svelte.js';
	import { getDepartureArrivalLabel } from '$lib/helpers/search-flight-helper';
	import { DateSelector } from '../date-selector';
	import { formatDate } from '$lib/helpers/date-helper';
	import { FlightSummary } from '../../../_components/flight-summary';
	import { FlightSelectionSummary } from '../flight-selection-summary';
	import { Funnel } from '@lucide/svelte';
	import { ShareSchedule } from '../share-schedule';
	import {
		ListViewModeToggle,
		type ListViewMode
	} from '../../../../(component)/list-view-mode-toggle';
	import { cn } from '$lib/utils';
	import { FlightTableRow } from '../flight-table-row';

	const { getSchedule } = useFlightService();
	const {
		state: pageState,
		getCurrentSchedule,
		getSelectedSchedule,
		handleFlightSelect,
		hasFilter,
		onClearFilter,
		scheduleResults,
		progressPercent,
		setSelectedFlightSearchParams
	} = useFlightSearchPage();

	let isOpenSelectionSummary = $state(false);
	let listViewMode = $state<ListViewMode>('list');

	const currentSchedule = $derived(getCurrentSchedule());
	const selectedSchedule = $derived(getSelectedSchedule());
	const canClearFilter = $derived(hasFilter());

	function openSelectionSummary() {
		isOpenSelectionSummary = true;
	}
</script>

<svelte:head>
	<title>{m.booking_flight()}</title>
</svelte:head>

<div class="relative">
	<SearchForm
		isLoading={$progressPercent.isLoading}
		onSubmitCallback={() => {
			pageState.currentScheduleIdx = 0;
			getSchedule();
		}}
		variant="sticky"
	/>

	<div class="container pt-0">
		<SearchProgress />

		{#if $scheduleResults.length > 0}
			<div class="mt-10"></div>

			<div class="flex items-start gap-6">
				<div class="flex-1">
					<div class="mb-4 flex items-end justify-between">
						<div class="flex items-center gap-3">
							<div
								class="bg-primary/70 text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-center font-medium"
							>
								{pageState.currentScheduleIdx + 1}
							</div>
							<div>
								<div class="flex items-center">
									<div class="text-lg font-semibold">
										Select {pageState.currentScheduleIdx === 0 ? 'Departure' : 'Return'} Flight
									</div>
								</div>
								<div class="text-muted-foreground flex text-sm">
									<div>
										{getDepartureArrivalLabel(currentSchedule)}
									</div>
								</div>
							</div>
						</div>
						<div>
							<ListViewModeToggle bind:value={listViewMode} />
						</div>
					</div>
					<div class="bg-primary/5 mb-4 rounded-lg px-16 py-2 shadow-sm">
						<DateSelector currentDate={formatDate(currentSchedule.departureDateTime)} />
					</div>

					<div class="mb-4 flex items-center gap-2">
						<Funnel class="text-gray-400" />
						<FilterAirline currentScheduleIdx={pageState.currentScheduleIdx} />
						<FilterTransit currentScheduleIdx={pageState.currentScheduleIdx} />
						<FilterTime currentScheduleIdx={pageState.currentScheduleIdx} />
						{#if canClearFilter}
							<Button variant="ghost" onclick={onClearFilter}>Clear</Button>
						{/if}
						<div class="ml-auto flex items-center gap-2">
							<ShareSchedule
								schedule={currentSchedule}
								currentScheduleIdx={pageState.currentScheduleIdx}
								flightType={pageState.searchFlightParam?.flightType!}
								route={getDepartureArrivalLabel(currentSchedule)}
							/>
							<FlightSort />
						</div>
					</div>

					<div>
						{#if listViewMode === 'table'}
							{@const thClass = 'bg-primary py-2 pr-4 text-white font-normal'}
							<div in:fly={{ y: -50 }}>
								<Card.Root class="py-0">
									<Card.Content class="px-0">
										<table class="w-full rounded-xl">
											<thead>
												<tr>
													<th class={cn(thClass, 'rounded-tl-md pl-2')}>Airline</th>
													<th class={thClass}>Number</th>
													<th class={thClass}>Origin</th>
													<th class={thClass}>Destination</th>
													<th class={thClass}>Duration</th>
													<th class={thClass}>Price and Class</th>
													<th class={cn(thClass, 'rounded-tr-md')}></th>
												</tr>
											</thead>
											{#each currentSchedule.trips as trip, i (trip.key)}
												<tbody animate:flip={{ duration: 300 }}>
													<FlightTableRow
														selectedFlightClassId={selectedSchedule.classess[
															pageState.currentScheduleIdx
														]?.uniqueId}
														onclick={setSelectedFlightSearchParams}
														onSelect={(selectedClassId) =>
															handleFlightSelect(selectedClassId, () => openSelectionSummary())}
														{trip}
														isLast={i === currentSchedule.trips.length - 1}
													/>
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
											{#each currentSchedule.trips as trip (trip.key)}
												<div animate:flip={{ duration: 300 }} transition:slide>
													<FlightCard
														selectedFlightClassId={selectedSchedule.classess[
															pageState.currentScheduleIdx
														]?.uniqueId}
														onclick={setSelectedFlightSearchParams}
														onSelect={(selectedClassId) =>
															handleFlightSelect(selectedClassId, () => openSelectionSummary())}
														{trip}
													></FlightCard>
												</div>
											{/each}
										</Accordion.Root>
									</Card.Content>
								</Card.Root>
							</div>
						{/if}
					</div>
				</div>

				<!-- Kolom kedua yang mengambil sisa ruang -->
				<div class="sticky top-28 w-[350px]">
					<div transition:slide>
						<FlightSummary
							currentSelectionIdx={pageState.currentScheduleIdx}
							trips={selectedSchedule.trips}
							type="selection"
							onChangeFlight={(idx) => {
								pageState.currentScheduleIdx = idx;
								window.scrollTo({
									top: 0,
									behavior: 'smooth'
								});
							}}
							flightClasses={selectedSchedule.classess}
						/>
					</div>
					<div class="mt-6"></div>
					{#if selectedSchedule.trips.length > 0}
						<div transition:slide>
							<FareDetailCard
								flightClasses={selectedSchedule.classess}
								trips={selectedSchedule.trips}
							/>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<FlightSkeleton />
		{/if}
	</div>
</div>

<FlightSelectionSummary
	bind:open={isOpenSelectionSummary}
	trips={selectedSchedule.trips}
	flightClasses={selectedSchedule.classess}
/>
