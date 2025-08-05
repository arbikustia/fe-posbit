import type { FlightResponse, ProviderProgress, ScheduleResult } from '$lib/types/FlightResponse';
import { writable, derived } from 'svelte/store';
import { formatDate, isTimeInRange } from '$lib/helpers/date-helper';
import {
	createFilterAirlineOptions,
	createFilterFlightTimeOptions,
	createFilterTransitOptions,
	type FilterFlightTimeOptions
} from '$lib/helpers/search-flight-helper';

export type FilterByAirline = string[];
export type FilterByTime = {
	departure: FilterFlightTimeOptions[];
	arrival: FilterFlightTimeOptions[];
};
export type FilterByTransit = {
	isDirect: boolean;
	isSingleTransit: boolean;
	isMultipleTransit: boolean;
	durations?: [number, number];
	locations: string[];
};

const rawFlightStore = writable<FlightResponse[]>([]);
export const sortBy = writable('price_asc');
export const filterByAirlines = writable<FilterByAirline[]>([]);
export const filterByTimes = writable<FilterByTime[]>([]);
export const filterByTransit = writable<FilterByTransit[]>([]);

// list provider for progress bar
const providerProgressStore = writable<ProviderProgress[]>([]);

export const scheduleResults = derived(
	[rawFlightStore, sortBy, filterByAirlines, filterByTimes],
	([$flightResponse, $sortBy]) => {
		const result: ScheduleResult[] = [];
		if ($flightResponse.length === 0 || !$flightResponse[0]?.schedules?.length) {
			return result;
		}

		$flightResponse[0].schedules.forEach((schedule) => {
			const trip = schedule.trips[0];
			result.push({
				origin: trip.origin,
				destination: trip.destination,
				departureDateTime: trip.departureDateTime,
				trips: []
			});
		});

		$flightResponse.forEach((rawFlt) => {
			rawFlt.schedules.forEach((schedule, scheduleIndex) => {
				schedule.trips.forEach((trip) => {
					result[scheduleIndex].trips.push(trip);
				});

				// sorting
				if ($sortBy == 'price_asc') {
					result[scheduleIndex].trips.sort(
						(tripA, tripB) =>
							tripA.classes[0].fare.paxFares[0].total - tripB.classes[0].fare.paxFares[0].total
					);
				} else if ($sortBy == 'price_desc') {
					result[scheduleIndex].trips.sort(
						(tripA, tripB) =>
							tripB.classes[0].fare.paxFares[0].total - tripA.classes[0].fare.paxFares[0].total
					);
				} else if ($sortBy == 'departure_asc') {
					result[scheduleIndex].trips.sort((tripA, tripB) =>
						formatDate(tripA.departureDateTime).localeCompare(formatDate(tripB.departureDateTime))
					);
				} else if ($sortBy == 'departure_desc') {
					result[scheduleIndex].trips.sort((tripA, tripB) =>
						formatDate(tripB.departureDateTime).localeCompare(formatDate(tripA.departureDateTime))
					);
				} else if ($sortBy == 'arrival_asc') {
					result[scheduleIndex].trips.sort((tripA, tripB) =>
						formatDate(tripA.arrivalDateTime).localeCompare(formatDate(tripB.arrivalDateTime))
					);
				} else if ($sortBy == 'arrival_desc') {
					result[scheduleIndex].trips.sort((tripA, tripB) =>
						formatDate(tripB.arrivalDateTime).localeCompare(formatDate(tripA.arrivalDateTime))
					);
				} else if ($sortBy == 'duration_asc') {
					result[scheduleIndex].trips.sort((tripA, tripB) =>
						tripA.travelTime.localeCompare(tripB.travelTime)
					);
				}
			});
		});
		return result;
	}
);

export const filterAirlineOptions = derived(rawFlightStore, ($flightResponse) =>
	createFilterAirlineOptions($flightResponse)
);

export const filterDepartureTimeOptions = derived(rawFlightStore, ($flightResponse) =>
	createFilterFlightTimeOptions($flightResponse, 'departureDateTime')
);
export const filterArrivalTimeOptions = derived(rawFlightStore, ($flightResponse) =>
	createFilterFlightTimeOptions($flightResponse, 'arrivalDateTime')
);

export const filterTransitOptions = derived(rawFlightStore, ($flightResponse) =>
	createFilterTransitOptions($flightResponse)
);

type ProgressPercent = {
	isLoading: boolean;
	percent: number;
};
export const progressPercent = derived(providerProgressStore, ($providerList) => {
	const result: ProgressPercent = {
		isLoading: true,
		percent: 0
	};

	if ($providerList.length === 0) {
		return result;
	}

	const allProviderLength = $providerList.length;
	const doneLength = $providerList.filter((o) => o.isDone).length;

	const percent = Math.round((doneLength / allProviderLength) * 100);
	result.percent = percent;

	if (percent == 100) {
		result.isLoading = false;
	}
	return result;
});

// method
export default {
	addFlightResult: function (raw: FlightResponse) {
		raw.schedules.forEach((o, schIndex) => {
			o.trips.forEach((trip, tripIndex) => {
				trip.key = `${trip.provider}_${Math.random().toString(36).substring(2, 9)}-${schIndex}-${tripIndex}`;

				// TODO: remove this when backend fixed the issue
				trip.classes.forEach((cls) => {
					cls.uniqueId += `_${Math.random().toString(36).substring(2, 9)}`;
				});
			});
		});

		rawFlightStore.update((list) => [...list, raw]);
		providerProgressStore.update((list) => {
			const find = list.find((o) => o.providerName == raw.provider);
			if (find) {
				find.isDone = true;
			}
			return list;
		});
	},

	setProviders: function (providerList: string[]) {
		const providerProgress: ProviderProgress[] = providerList.map((provider) => ({
			providerName: provider,
			isDone: false,
			duration: 0
		}));
		providerProgressStore.set(providerProgress);
	},
	reset: function () {
		rawFlightStore.set([]);
		sortBy.set('price_asc');
		filterByAirlines.set([]);
		filterByTimes.set([]);
		filterByTransit.set([]);
	}
};
