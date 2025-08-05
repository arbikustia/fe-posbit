<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import { displayDate, formatDate } from '$lib/helpers/date-helper';
	import { getCompanyName, getDepartureArrivalLabel } from '$lib/helpers/search-flight-helper';
	import { useFlightService } from '$lib/hooks/use-flight-service.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { flip } from 'svelte/animate';
	import { fly, slide } from 'svelte/transition';
	import { FlightRouteInfo } from '../../../_components/flight-route-info';
	import { MSearchForm } from '../../../_components/search-form';
	import { MFilterAirline } from '../filter-airline';
	import { MFilterTime } from '../filter-time';
	import { MFilterTransit } from '../filter-transit';
	import { MFlightCard } from '../flight-card';
	import { MAppBarFlightSkeleton, MFlightSkeleton } from '../flight-skeleton';
	import { MFlightSort } from '../flight-sort';
	import { MSelectedFlightList } from '../m-selected-flight-list';
	import { MSearchProgress } from '../search-progress';
	import { useFlightSearchPage } from './flight-search-page.svelte.js';
	import { MDateSelector } from '../date-selector';
	import { MFlightSelectionSummary } from '../flight-selection-summary';
	import { MShareSchedule } from '../share-schedule';

	const { getSchedule } = useFlightService();
	const {
		state: pageState,
		getCurrentSchedule,
		getSelectedSchedule,
		handleFlightSelect,
		scheduleResults,
		progressPercent,
		setSelectedFlightSearchParams
	} = useFlightSearchPage();

	// state for mobile only
	let isOpenSearchPanel = $state(false);
	let isOpenFlightSelectionSummary = $state(false);

	const currentSchedule = $derived(getCurrentSchedule());
	const selectedSchedule = $derived(getSelectedSchedule());

	function openSearchPanel() {
		isOpenSearchPanel = true;
	}

	function closeSearchPanel() {
		isOpenSearchPanel = false;
	}

	function openFlightSelectionSummary() {
		isOpenFlightSelectionSummary = true;
	}

	function closeFlightSelectionSummary() {
		isOpenFlightSelectionSummary = false;
	}
</script>

<svelte:head>
	<title>{m.booking_flight()}</title>
</svelte:head>

<div>
	{#if $scheduleResults.length > 0}
		<MOSGAppBar>
			{#snippet leftContent()}
				<div>
					<div class="flex items-center gap-1 font-semibold">
						<FlightRouteInfo
							origin={currentSchedule.origin.city.name}
							destination={currentSchedule.destination.city.name}
						/>
					</div>
					<div class="item-center flex">
						<p class="line-clamp-1 text-xs text-gray-500">
							{displayDate(currentSchedule.departureDateTime, 'DD MMM YYYY')} ∙{' '}
							{(pageState.searchFlightParam?.adult ?? 0) +
								(pageState.searchFlightParam?.child ?? 0) +
								(pageState.searchFlightParam?.infant ?? 0)} Pax ∙ {getCompanyName(
								pageState.searchFlightParam?.companyCode ?? ''
							)}
						</p>
					</div>
				</div>
			{/snippet}
			{#snippet rightContent()}
				<div class="flex items-center gap-2">
					<MShareSchedule
						schedule={currentSchedule}
						currentScheduleIdx={pageState.currentScheduleIdx}
						flightType={pageState.searchFlightParam?.flightType!}
						route={getDepartureArrivalLabel(currentSchedule)}
					/>
					<Button class="h-fit py-2 text-xs shadow-none" onclick={openSearchPanel}>Change</Button>
				</div>
			{/snippet}
		</MOSGAppBar>
	{:else}
		<MAppBarFlightSkeleton />
	{/if}
</div>

<div class="fixed top-16 w-full max-w-lg">
	<MSearchProgress />
</div>

<div class="pt-14">
	{#if $scheduleResults.length > 0}
		{#if !$progressPercent.isLoading}
			<div class="sticky top-16 z-10 w-full" transition:fly>
				{#if selectedSchedule.classess.length > 0}
					<MSelectedFlightList
						currentSelectionIdx={pageState.currentScheduleIdx}
						trips={selectedSchedule.trips}
						onChangeFlight={(idx) => {
							pageState.currentScheduleIdx = idx;
							window.scrollTo({
								top: 0,
								behavior: 'smooth'
							});
						}}
						flightClasses={selectedSchedule.classess}
					/>
				{/if}
				<div class="border-t bg-white py-2 text-center text-xs text-gray-500">
					{#if pageState.searchFlightParam?.flightType === 'roundtrip' || pageState.searchFlightParam?.flightType === 'oneway'}
						{pageState.currentScheduleIdx > 0 ? 'Return Flight' : 'Departure Flight'}
					{:else}
						Flight {pageState.currentScheduleIdx + 1}
					{/if}
				</div>
			</div>
		{/if}
		<div class="space-y-2 px-2 pb-16 pt-4">
			<MDateSelector currentDate={formatDate(currentSchedule.departureDateTime)} />
			{#each currentSchedule.trips as trip (trip.key)}
				<div animate:flip={{ duration: 300 }} transition:slide>
					<MFlightCard
						selectedFlightClassId={selectedSchedule.classess[pageState.currentScheduleIdx]
							?.uniqueId}
						onclick={setSelectedFlightSearchParams}
						onSelect={(selectedClassId) =>
							handleFlightSelect(selectedClassId, openFlightSelectionSummary)}
						{trip}
					/>
				</div>
			{/each}
		</div>
		<div class="fixed bottom-0 w-full max-w-lg">
			<Card.Root class="rounded-none py-0">
				<Card.Content class="w-full p-0">
					<div class="flex justify-around py-2">
						<MFilterAirline currentScheduleIdx={pageState.currentScheduleIdx} />
						<MFilterTransit />
						<MFilterTime currentScheduleIdx={pageState.currentScheduleIdx} />
						<MFlightSort />
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<MFlightSkeleton />
	{/if}
</div>

<!-- Search Flight Panel -->
<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Search New Flight</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-[70vh] overflow-y-auto">
			<MSearchForm
				onSubmitCallback={() => {
					pageState.currentScheduleIdx = 0;
					closeSearchPanel();
					getSchedule();
				}}
				isLoading={$progressPercent.isLoading}
			/>
		</div>
	</Drawer.Content>
</Drawer.Root>

<MFlightSelectionSummary
	bind:open={isOpenFlightSelectionSummary}
	trips={selectedSchedule.trips}
	flightClasses={selectedSchedule.classess}
/>
