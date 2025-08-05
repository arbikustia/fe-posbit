import { goto } from '$app/navigation';
import { page } from '$app/state';
import { isTimeInRange } from '$lib/helpers/date-helper';
import {
	filterByAirlines,
	filterByTimes,
	filterByTransit,
	progressPercent,
	scheduleResults,
	type FilterByTransit
} from '$lib/stores/flightStore';
import { SELECTED_FLIGHT_SEARCH_PARAMS_KEY } from './constants';
import { fromStore, get } from 'svelte/store';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
import {
	convertUrlParamToSearchFlightParam,
	filterSchedulesByTransit
} from '$lib/helpers/search-flight-helper';
import type { ScheduleResult } from '$lib/types/FlightResponse';

type FlightSearchPageState = {
	currentScheduleIdx: number;
	searchFlightParam?: SearchFlightParam;
};

export function useFlightSearchPage() {
	const _scheduleResults = fromStore(scheduleResults);
	const _filterByAirlines = fromStore(filterByAirlines);
	const _filterByTimes = fromStore(filterByTimes);
	const _filterByTransit = fromStore(filterByTransit);

	const state = $state<FlightSearchPageState>({
		currentScheduleIdx: 0,
		searchFlightParam: undefined
	});

	function getCurrentSchedule() {
		const cloneScheduleResults = {
			..._scheduleResults.current[state.currentScheduleIdx]
		};
		// filter by airlines
		if (_filterByAirlines.current[state.currentScheduleIdx]?.length > 0) {
			cloneScheduleResults.trips = cloneScheduleResults.trips.filter((trip) =>
				_filterByAirlines.current[state.currentScheduleIdx].includes(trip.platingCarrier.code)
			);
		}

		// filter by departure time
		if (_filterByTimes.current[state.currentScheduleIdx]?.departure.length > 0) {
			cloneScheduleResults.trips = cloneScheduleResults.trips.filter((trip) =>
				_filterByTimes.current[state.currentScheduleIdx].departure.some((time) => {
					return isTimeInRange(trip.departureDateTime, time.from, time.to);
				})
			);
		}

		// filter by arrival time
		if (_filterByTimes.current[state.currentScheduleIdx]?.arrival.length > 0) {
			cloneScheduleResults.trips = cloneScheduleResults.trips.filter((trip) =>
				_filterByTimes.current[state.currentScheduleIdx].arrival.some((time) => {
					return isTimeInRange(trip.arrivalDateTime, time.from, time.to);
				})
			);
		}

		if (_filterByTransit.current[state.currentScheduleIdx]) {
			cloneScheduleResults.trips = filterSchedulesByTransit(
				cloneScheduleResults.trips,
				_filterByTransit.current[state.currentScheduleIdx]
			);
		}

		return cloneScheduleResults;
	}

	function hasFilter() {
		return (
			_filterByAirlines.current[state.currentScheduleIdx]?.length > 0 ||
			_filterByTimes.current[state.currentScheduleIdx]?.departure.length > 0 ||
			_filterByTimes.current[state.currentScheduleIdx]?.arrival.length > 0 ||
			!!_filterByTransit.current[state.currentScheduleIdx]
		);
	}

	function getSelectedSchedule() {
		const selectedIds = new Set(); // O(1) lookup
		const classess = [];
		const trips = [];

		// Collect selected IDs from query params
		for (const [key, value] of page.url.searchParams) {
			if (key.includes(SELECTED_FLIGHT_SEARCH_PARAMS_KEY)) {
				selectedIds.add(value);
			}
		}

		let scheduleIdx = 0;

		for (const schedule of _scheduleResults.current) {
			for (const trip of schedule.trips) {
				const selectedClasses = trip.classes.find((cls) => selectedIds.has(cls.uniqueId));
				if (selectedClasses) {
					classess[scheduleIdx] = selectedClasses;
					trips[scheduleIdx] = trip;
				}
			}
			scheduleIdx++;
		}

		return { classess, trips };
	}

	function setSelectedFlightSearchParams(selectedClassId: string, noScroll = true) {
		page.url.searchParams.set(
			`${SELECTED_FLIGHT_SEARCH_PARAMS_KEY}-${state.currentScheduleIdx}`,
			selectedClassId
		);

		goto(page.url, { replaceState: true, noScroll: noScroll });
	}

	function handleFlightSelect(selectedClassId: string, onFinishedSelection: () => void) {
		const hasNextSelect = state.currentScheduleIdx < get(scheduleResults).length - 1;
		setSelectedFlightSearchParams(selectedClassId, !hasNextSelect);

		if (hasNextSelect) {
			state.currentScheduleIdx++;
		} else {
			onFinishedSelection();
		}
	}

	function onClearFilter() {
		filterByAirlines.update((airlines) => {
			airlines[state.currentScheduleIdx] = [];
			return airlines;
		});
		filterByTimes.update((times) => {
			times[state.currentScheduleIdx] = {
				departure: [],
				arrival: []
			};
			return times;
		});
		filterByTransit.update((transit) => {
			transit[state.currentScheduleIdx] = undefined as unknown as FilterByTransit;
			return transit;
		});
	}

	$effect(() => {
		state.searchFlightParam = convertUrlParamToSearchFlightParam();
	});

	return {
		state,
		getCurrentSchedule,
		getSelectedSchedule,
		hasFilter,
		handleFlightSelect,
		onClearFilter,
		scheduleResults,
		progressPercent,
		setSelectedFlightSearchParams
	};
}
