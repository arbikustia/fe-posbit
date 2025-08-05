import { filterAirlineOptions, filterByAirlines } from '$lib/stores/flightStore';
import { tick } from 'svelte';
import type { FilterAirlineState } from './types';

export function useFilterAirline() {
	const state = $state<FilterAirlineState>({
		selectedValues: [],
		open: false,
		triggerRef: null!
	});

	function toggleSelection(airlineCode: string) {
		if (state.selectedValues.includes(airlineCode)) {
			state.selectedValues = state.selectedValues.filter((code) => code !== airlineCode);
		} else {
			state.selectedValues = [...state.selectedValues, airlineCode];
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

	function onDone(currentScheduleIdx: number) {
		filterByAirlines.update((airlines) => {
			airlines[currentScheduleIdx] = state.selectedValues;
			return airlines;
		});
		closeAndFocusTrigger();
	}

	function onReset() {
		state.selectedValues = [];
	}

	return {
		state,
		toggleSelection,
		closeAndFocusTrigger,
		onDone,
		onReset,
		filterAirlineOptions,
		filterByAirlines
	};
}
