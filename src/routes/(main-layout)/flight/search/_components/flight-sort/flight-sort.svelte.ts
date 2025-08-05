import { sortBy } from '$lib/stores/flightStore';
import { tick } from 'svelte';
import { sortingList } from './constants';

type FlightSortState = {
	open: boolean;
	value: string;
	triggerRef: HTMLButtonElement;
};

export function useFlightSort() {
	const state = $state<FlightSortState>({
		open: false,
		value: 'price_asc',
		triggerRef: null!
	});

	function getSelectedValue() {
		return sortingList.find((f) => f.value === state.value)?.label ?? 'Sort';
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

	$effect(() => {
		sortBy.set(state.value);
	});

	return {
		state,
		closeAndFocusTrigger,
		getSelectedValue
	};
}
