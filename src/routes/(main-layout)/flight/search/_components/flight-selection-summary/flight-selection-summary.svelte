<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { displayDate } from '$lib/helpers/date-helper';
	import {
		convertUrlParamToSearchFlightParam,
		displayPassengerDetail,
		getCompanyName
	} from '$lib/helpers/search-flight-helper';
	import { scheduleResults } from '$lib/stores/flightStore';
	import { cn } from '$lib/utils';
	import { FareDetailCard } from '../../../_components/fare-detail-card';
	import { FlightRouteInfo } from '../../../_components/flight-route-info';
	import { FlightSummaryCompanyHeader } from '../../../_components/flight-summary';
	import FlightSummaryClassDetail from '../../../_components/flight-summary/flight-summary-class-detail.svelte';
	import FlightSummarySegmentLabel from '../../../_components/flight-summary/flight-summary-segment-label.svelte';
	import { SELECTED_FLIGHT_SEARCH_PARAMS_KEY } from '../page/constants';
	import FlightSelectionSummaryTripItem from './flight-selection-summary-trip-item.svelte';
	import type { FlightSelectionSummaryProps } from './types';

	let { open = $bindable(), trips, flightClasses }: FlightSelectionSummaryProps = $props();

	const searchFlightParam = $derived(convertUrlParamToSearchFlightParam());
	const departureSchedule = $derived($scheduleResults[0]);

	function onSelectedClassIdChange(idx: number, selectedClassId: string) {
		page.url.searchParams.set(`${SELECTED_FLIGHT_SEARCH_PARAMS_KEY}-${idx}`, selectedClassId);

		goto(page.url, { replaceState: true, noScroll: true });
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="lg:max-w-200 gap-0 overflow-hidden p-0">
		<Dialog.Header class="bg-card z-10 p-4 px-8 shadow-md">
			<Dialog.Title class="space-y-1">
				{#if searchFlightParam.flightType === 'multicity'}
					<p class="font-semibold">Multi City ({$scheduleResults.length} Flights)</p>
				{:else}
					<FlightRouteInfo
						origin={departureSchedule.origin.city.name}
						destination={departureSchedule.destination.city.name}
						originAirportCode={departureSchedule.origin.airport.code}
						destinationAirportCode={departureSchedule.destination.airport.code}
						flightType={searchFlightParam.flightType}
					/>
				{/if}
				<p class="text-sm font-normal text-gray-500">
					{displayPassengerDetail({
						adult: searchFlightParam.adult,
						child: searchFlightParam.child,
						infant: searchFlightParam.infant
					})}
				</p>
			</Dialog.Title>
		</Dialog.Header>
		<div class="max-h-[calc(100vh-200px)] overflow-y-auto bg-gray-100 px-8 py-8">
			<div class="grid grid-cols-12 gap-8">
				<div class="col-span-7 space-y-10">
					{#each trips as trip, i}
						<div class="space-y-4">
							<FlightSummarySegmentLabel
								label={searchFlightParam.flightType === 'multicity'
									? i + 1
									: i === 0
										? 'Departure'
										: 'Return'}
								labelType={searchFlightParam.flightType === 'multicity' ? 'number' : 'text'}
								dateTime={trip.departureDateTime}
								isActive={false}
							/>
							<div class="space-y-2">
								<FlightSelectionSummaryTripItem
									selectedFlightClassId={flightClasses[i]?.uniqueId}
									onClassSelect={(selectedClassId) => onSelectedClassIdChange(i, selectedClassId)}
									{trip}
								/>
								<FlightSummaryClassDetail />
							</div>
						</div>
					{/each}
				</div>

				<div class="col-span-5 space-y-4">
					<FlightSummaryCompanyHeader
						companyName={getCompanyName(searchFlightParam.companyCode) ?? ''}
					/>
					<FareDetailCard {flightClasses} {trips} useAccordion={false} />
				</div>
			</div>
		</div>

		<Dialog.Footer class="bg-card z-10 border-t-2 p-4 shadow-md">
			<Button href="/flight/booking">Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
