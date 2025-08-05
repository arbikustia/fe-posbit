import { flightTimeFilterDefaultOptions } from '$lib/constants/flight';
import {
	filterArrivalTimeOptions,
	filterByTimes,
	filterDepartureTimeOptions
} from '$lib/stores/flightStore';
import { tick } from 'svelte';
import { fromStore } from 'svelte/store';
import type { FilterTimeState } from './types';

export function useFilterTime() {
	const state = $state<FilterTimeState>({
		selectedDepartureTimes: [],
		selectedArrivalTimes: [],
		open: false,
		triggerRef: null!
	});

	function getSelectedCount() {
		return state.selectedDepartureTimes.length + state.selectedArrivalTimes.length;
	}

	function getAppliedFilterCount(currentScheduleIdx: number) {
		const filterByTimesValue = fromStore(filterByTimes).current;

		return (
			filterByTimesValue[currentScheduleIdx]?.departure?.length +
			filterByTimesValue[currentScheduleIdx]?.arrival?.length
		);
	}

	function toggleSelectionDepartureTime(flightTimeKey: string) {
		if (state.selectedDepartureTimes.includes(flightTimeKey)) {
			state.selectedDepartureTimes = state.selectedDepartureTimes.filter(
				(key) => key !== flightTimeKey
			);
		} else {
			state.selectedDepartureTimes = [...state.selectedDepartureTimes, flightTimeKey];
		}
	}

	function toggleSelectionArrivalTime(flightTimeKey: string) {
		if (state.selectedArrivalTimes.includes(flightTimeKey)) {
			state.selectedArrivalTimes = state.selectedArrivalTimes.filter(
				(key) => key !== flightTimeKey
			);
		} else {
			state.selectedArrivalTimes = [...state.selectedArrivalTimes, flightTimeKey];
		}
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		state.open = false;
		tick().then(() => {
			state.triggerRef.focus();
		});
	}

	function resetAllSelectedValue() {
		state.selectedDepartureTimes = [];
		state.selectedArrivalTimes = [];
	}

	function setFilterByTimeStore(currentScheduleIdx: number) {
		filterByTimes.update((times) => {
			times[currentScheduleIdx] = {
				departure:
					state.selectedDepartureTimes.length > 0
						? flightTimeFilterDefaultOptions.filter((item) =>
								state.selectedDepartureTimes.includes(item.key)
							)
						: [],
				arrival:
					state.selectedArrivalTimes.length > 0
						? flightTimeFilterDefaultOptions.filter((item) =>
								state.selectedArrivalTimes.includes(item.key)
							)
						: []
			};
			return times;
		});
	}

	function onDone(currentScheduleIdx: number) {
		setFilterByTimeStore(currentScheduleIdx);
		closeAndFocusTrigger();
	}

	function onReset() {
		resetAllSelectedValue();
	}

	return {
		state,
		toggleSelectionDepartureTime,
		toggleSelectionArrivalTime,
		closeAndFocusTrigger,
		onDone,
		onReset,
		getSelectedCount,
		getAppliedFilterCount,
		filterByTimes,
		filterDepartureTimeOptions,
		filterArrivalTimeOptions
	};
}
