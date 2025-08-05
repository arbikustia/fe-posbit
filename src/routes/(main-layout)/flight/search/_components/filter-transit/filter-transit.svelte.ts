import {
	filterByTransit,
	filterTransitOptions,
	type FilterByTransit
} from '$lib/stores/flightStore';
import { tick } from 'svelte';
import { fromStore } from 'svelte/store';

type FilterTransitState = {
	open: boolean;
	triggerRef: HTMLButtonElement;
	isDirect: boolean;
	isSingleTransit: boolean;
	isMultipleTransit: boolean;
	transitDuration: [number, number];
	transitLocations: string[];
};

export function useFilterTransit() {
	const _filterTransitOptions = fromStore(filterTransitOptions);
	const _filterByTransit = fromStore(filterByTransit);

	const state = $state<FilterTransitState>({
		open: false,
		triggerRef: null!,
		isDirect: false,
		isSingleTransit: false,
		isMultipleTransit: false,
		transitDuration: [0, 24],
		transitLocations: []
	});

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		state.open = false;
		tick().then(() => {
			state.triggerRef.focus();
		});
	}

	function getFilterCount() {
		return (
			Number(state.isDirect) +
			Number(state.isSingleTransit) +
			Number(state.isMultipleTransit) +
			Number(
				state.transitDuration[0] !== 0 ||
					state.transitDuration[1] !== _filterTransitOptions.current.maxTransitDuration
			) +
			state.transitLocations.length
		);
	}

	function getAppliedFilterCount(currentScheduleIdx: number) {
		if (_filterByTransit.current[currentScheduleIdx]) {
			return (
				Number(_filterByTransit.current[currentScheduleIdx].isDirect) +
				Number(_filterByTransit.current[currentScheduleIdx].isSingleTransit) +
				Number(_filterByTransit.current[currentScheduleIdx].isMultipleTransit) +
				Number(!!_filterByTransit.current[currentScheduleIdx].durations) +
				_filterByTransit.current[currentScheduleIdx].locations.length
			);
		}

		return 0;
	}

	function onDone(currentScheduleIdx: number) {
		const hasFilter =
			state.isDirect ||
			state.isSingleTransit ||
			state.isMultipleTransit ||
			state.transitDuration[0] !== 0 ||
			state.transitDuration[1] !== _filterTransitOptions.current.maxTransitDuration ||
			state.transitLocations.length > 0;

		if (hasFilter) {
			filterByTransit.update((current) => {
				current[currentScheduleIdx] = {
					isDirect: state.isDirect,
					isSingleTransit: state.isSingleTransit,
					isMultipleTransit: state.isMultipleTransit,
					durations:
						state.transitDuration[0] === 0 &&
						state.transitDuration[1] === _filterTransitOptions.current.maxTransitDuration
							? undefined
							: state.transitDuration,
					locations: state.transitLocations
				};
				return current;
			});
		} else {
			filterByTransit.update((current) => {
				current[currentScheduleIdx] = undefined as unknown as FilterByTransit;
				return current;
			});
		}

		closeAndFocusTrigger();
	}

	function onReset() {
		state.isDirect = false;
		state.isSingleTransit = false;
		state.isMultipleTransit = false;
		state.transitDuration = [0, _filterTransitOptions.current.maxTransitDuration];
		state.transitLocations = [];
	}

	return {
		state,
		filterTransitOptions,
		filterByTransit,
		onReset,
		onDone,
		getFilterCount,
		getAppliedFilterCount
	};
}
