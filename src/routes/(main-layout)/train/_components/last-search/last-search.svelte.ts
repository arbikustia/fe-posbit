import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import type { SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
import { onMount } from 'svelte';

type LastSearchState = {
	lastSearches: SearchTrainParam[];
};

export function useLastSearch() {
	let state = $state<LastSearchState>({
		lastSearches: []
	});

	function getLastSearchData() {
		const lastSearchFromStorage =
			localStorageHelper.getItem<SearchTrainParam[]>(localStorageKey.train.lastSearch) ?? [];

		const filterValidSearches = lastSearchFromStorage.filter((search) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Set to start of today

			const isValidRoute = search.route?.departureDate
				? new Date(search.route.departureDate) >= today
				: false;

			return isValidRoute;
		});

		// remove invalid search data
		localStorageHelper.setItem(localStorageKey.train.lastSearch, filterValidSearches);

		state.lastSearches = filterValidSearches.reverse();
	}

	function clearLastSearch() {
		state.lastSearches = [];
		localStorageHelper.removeItem(localStorageKey.train.lastSearch);
	}

	onMount(() => {
		getLastSearchData();
	});

	return {
		state,
		clearLastSearch
	};
}
