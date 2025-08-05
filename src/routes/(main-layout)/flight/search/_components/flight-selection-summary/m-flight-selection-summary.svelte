<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { formatThousand } from '$lib/helpers/number-helper';
	import {
		convertUrlParamToSearchFlightParam,
		displayPassengerDetail,
		getCompanyName
	} from '$lib/helpers/search-flight-helper';
	import { scheduleResults } from '$lib/stores/flightStore';
	import { ArrowLeft, ChevronUp } from '@lucide/svelte';
	import { FlightRouteInfo } from '../../../_components/flight-route-info';
	import { FlightSummaryCompanyHeader } from '../../../_components/flight-summary';
	import FlightSummaryClassDetail from '../../../_components/flight-summary/flight-summary-class-detail.svelte';
	import FlightSummarySegmentLabel from '../../../_components/flight-summary/flight-summary-segment-label.svelte';
	import { MFlightCard } from '../flight-card';
	import { SELECTED_FLIGHT_SEARCH_PARAMS_KEY } from '../page/constants';
	import type { FlightSelectionSummaryProps } from './types';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';

	let { open = $bindable(), trips, flightClasses }: FlightSelectionSummaryProps = $props();

	let isOpenFareDetail = $state(false);

	const searchFlightParam = $derived(convertUrlParamToSearchFlightParam());

	const totalFare = $derived(
		flightClasses.reduce((sum, flightClass) => {
			const fareTotal = flightClass.fare.total;
			return sum + fareTotal;
		}, 0)
	);

	const departureSchedule = $derived($scheduleResults[0]);

	function openFareDetail() {
		isOpenFareDetail = true;
	}

	function onSelectedClassIdChange(idx: number, selectedClassId: string) {
		page.url.searchParams.set(`${SELECTED_FLIGHT_SEARCH_PARAMS_KEY}-${idx}`, selectedClassId);

		goto(page.url, { replaceState: true, noScroll: true });
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Content
		class="border-none p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="static max-w-full bg-primary/85 text-primary-foreground">
			{#snippet leftAction()}
				<button
					onclick={() => {
						open = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div>
					{#if searchFlightParam.flightType === 'multicity'}
						<div>{$scheduleResults.length} Flights</div>
					{:else}
						<FlightRouteInfo
							origin={departureSchedule.origin.city.name}
							destination={departureSchedule.destination.city.name}
							flightType={searchFlightParam.flightType}
						/>
					{/if}
					<p class="text-xs">
						{displayPassengerDetail({
							adult: searchFlightParam.adult,
							child: searchFlightParam.child,
							infant: searchFlightParam.infant
						})}
					</p>
				</div>
			{/snippet}
		</MOSGAppBar>

		<div class="space-y-8 overflow-y-auto px-4 pb-28 pt-4">
			<FlightSummaryCompanyHeader
				companyName={getCompanyName(searchFlightParam.companyCode) ?? ''}
			/>
			{#each trips as trip, i}
				<div class="space-y-4">
					<FlightSummarySegmentLabel label={i + 1} dateTime={trip.departureDateTime} />
					<div class="space-y-2">
						<MFlightCard
							selectedFlightClassId={flightClasses[i]?.uniqueId}
							onSelect={(selectedClassId) => onSelectedClassIdChange(i, selectedClassId)}
							onclick={(selectedClassId) => onSelectedClassIdChange(i, selectedClassId)}
							{trip}
							mode="view"
						/>
						<FlightSummaryClassDetail />
					</div>
				</div>
			{/each}
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			<div>
				<p class="text-sm">Total for all pax</p>
				<button class="flex items-center gap-x-1" onclick={openFareDetail}>
					<p class="font-semibold">
						{formatThousand(totalFare)}
						{flightClasses?.[0]?.fare.currency}
					</p>
					<ChevronUp class="h-5 w-5" />
				</button>
			</div>
			<Button class="px-8" href="/flight/booking">Continue</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<Drawer.Root bind:open={isOpenFareDetail}>
	<Drawer.Content class="border-none p-0">
		<Drawer.Header>
			<Drawer.Title>Fare Detail</Drawer.Title>
		</Drawer.Header>

		<div class="space-y-4 px-4 pb-4">
			{#each flightClasses as flighClass, i}
				<div class="space-y-2">
					<p class="font-semibold">
						{trips[i].origin.airport.code} → {trips[i].destination.airport.code}
					</p>
					{#each flighClass.fare.paxFares as paxFare}
						<div class="flex justify-between text-muted-foreground">
							<div>Base Fare x {paxFare.paxCount} {paxFare.paxType}</div>
							<div>{formatThousand(paxFare.total)} {paxFare.base.currency}</div>
						</div>
					{/each}
				</div>
			{/each}
			<div class="flex justify-between font-semibold">
				<div>Total</div>
				<div>{formatThousand(totalFare)} {flightClasses?.[0]?.fare.currency}</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
