<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		convertUrlParamToSearchFlightParam,
		displayPassengerDetail,
		getCompanyName
	} from '$lib/helpers/search-flight-helper';
	import { scheduleResults } from '$lib/stores/flightStore';
	import type { FlightClass, Trip } from '$lib/types/FlightResponse';
	import { FlightRouteInfo } from '../flight-route-info';
	import FlightSummaryCompanyHeader from './flight-summary-company-header.svelte';
	import SummaryCardItem from './flight-summary-item.svelte';

	type FlightSummaryProps = {
		type?: 'default' | 'selection';
		currentSelectionIdx?: number; // props for selection type
		trips: Trip[];
		flightClasses: FlightClass[];
		paxNumber?: string;
		company?: string;
		onChangeFlight?: (idx: number) => void;
	};

	let {
		type = 'default',
		currentSelectionIdx,
		trips = [],
		onChangeFlight,
		flightClasses,
		paxNumber,
		company
	}: FlightSummaryProps = $props();

	const searchParams = convertUrlParamToSearchFlightParam();

	const displayPax = $derived.by(() => {
		if (type === 'selection') {
			const { adult, child, infant } = searchParams;
			return displayPassengerDetail({ adult, child, infant });
		}
		return paxNumber;
	});

	const companyName = $derived.by(() => {
		if (type === 'selection') {
			const { companyCode } = searchParams;

			return getCompanyName(companyCode);
		}

		return company;
	});

	const departureSchedule = $derived.by(() => {
		if (type === 'selection') {
			return $scheduleResults[0];
		}

		return trips[0];
	});
</script>

{#snippet selectionContent()}
	<Card.Root class="gap-0 overflow-hidden py-0">
		<Card.Header class="bg-primary/85 text-primary-foreground py-4 ">
			{#if searchParams.flightType === 'multicity'}
				<div>Multi City ({$scheduleResults.length} Flights)</div>
			{:else}
				<FlightRouteInfo
					origin={departureSchedule.origin.city.name}
					destination={departureSchedule.destination.city.name}
					originAirportCode={departureSchedule.origin.airport.code}
					destinationAirportCode={departureSchedule.destination.airport.code}
					flightType={searchParams.flightType}
				/>
			{/if}

			<div class="text-primary-foreground/70">{displayPax}</div>
		</Card.Header>
		<Card.Content class="px-0 py-4">
			<!-- COMPANY -->
			<div class="mb-6 flex items-center gap-2 px-4">
				<FlightSummaryCompanyHeader companyName={companyName ?? ''} />
			</div>

			<div class="space-y-4">
				{#each $scheduleResults as scheduleResult, scheduleResultIdx}
					<SummaryCardItem
						idx={scheduleResultIdx}
						trip={trips[scheduleResultIdx]}
						origin={scheduleResult.origin}
						destination={scheduleResult.destination}
						departureDateTime={scheduleResult.departureDateTime}
						isActive={currentSelectionIdx === scheduleResultIdx}
						isMultiFlight={searchParams.flightType !== 'oneway'}
						classId={flightClasses[scheduleResultIdx].uniqueId}
						isSelection={true}
						{onChangeFlight}
					/>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet viewContent()}
	<Card.Root class="gap-0 overflow-hidden py-0">
		<Card.Header class="bg-primary/85 text-primary-foreground py-4 ">
			{#if trips.length > 2}
				<div>Multi City ({trips.length} Flights)</div>
			{:else}
				<FlightRouteInfo
					origin={departureSchedule.origin.city.name}
					destination={departureSchedule.destination.city.name}
					originAirportCode={departureSchedule.origin.airport.code}
					destinationAirportCode={departureSchedule.destination.airport.code}
					flightType={trips.length > 1 ? 'roundtrip' : 'oneway'}
				/>
			{/if}

			<div class="text-primary-foreground/70">{displayPax}</div>
		</Card.Header>
		<Card.Content class="px-0 py-4">
			<!-- COMPANY -->
			<div class="mb-6 flex items-center gap-2 px-4">
				<FlightSummaryCompanyHeader companyName={companyName ?? ''} />
			</div>

			<div class="space-y-4">
				{#each trips as trip, tripIdx}
					<SummaryCardItem
						idx={tripIdx}
						trip={trips[tripIdx]}
						origin={trip.origin}
						destination={trip.destination}
						departureDateTime={trip.departureDateTime}
						isActive={currentSelectionIdx === tripIdx}
						isMultiFlight={trips.length > 1}
						classId={flightClasses[tripIdx].uniqueId}
					/>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

{#if type === 'selection'}
	{@render selectionContent()}
{:else}
	{@render viewContent()}
{/if}
