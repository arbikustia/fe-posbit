import { sortBy } from '$lib/stores/flightStore';
import { tick } from 'svelte';
import { sortingList } from './constants';

type TrainSortState = {
	open: boolean;
	value: string;
};

export function useTrainSort() {
	const state = $state<TrainSortState>({
		open: false,
		value: 'price_asc'
	});

	function getSelectedValue() {
		return sortingList.find((f) => f.value === state.value)?.label ?? 'Sort';
	}

	function close() {
		state.open = false;
	}

	$effect(() => {
		sortBy.set(state.value);
	});

	return {
		state,
		close,
		getSelectedValue
	};
}
