import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import type { SearchHotelParam } from '$lib/types/Hotel';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
import { onMount } from 'svelte';

type LastSearchState = {
	lastSearches: SearchHotelParam[];
};

export function useLastSearch() {
	let state = $state<LastSearchState>({
		lastSearches: []
	});

	function getLastSearchData() {
		const lastSearchFromStorage =
			localStorageHelper.getItem<SearchHotelParam[]>(localStorageKey.hotel.lastSearch) ?? [];

		const filterValidSearches = lastSearchFromStorage.filter((search) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Set to start of today
			return search
		});

		// remove invalid search data
		localStorageHelper.setItem(localStorageKey.hotel.lastSearch, filterValidSearches);

		state.lastSearches = filterValidSearches.reverse();
	}

	function clearLastSearch() {
		state.lastSearches = [];
		localStorageHelper.removeItem(localStorageKey.hotel.lastSearch);
	}

	onMount(() => {
		getLastSearchData();
	});

	return {
		state,
		clearLastSearch
	};
}
