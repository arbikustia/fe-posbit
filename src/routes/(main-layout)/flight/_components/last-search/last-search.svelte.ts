import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
import { onMount } from 'svelte';

type LastSearchState = {
	lastSearches: SearchFlightParam[];
};

export function useLastSearch() {
	let state = $state<LastSearchState>({
		lastSearches: []
	});

	function getLastSearchData() {
		const lastSearchFromStorage =
			localStorageHelper.getItem<SearchFlightParam[]>(localStorageKey.flight.lastSearch) ?? [];

		const filterValidSearches = lastSearchFromStorage.filter((search) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Set to start of today

			const isValidRoute = search.route?.departureDate
				? new Date(search.route.departureDate) >= today
				: false;

			const isValidMultiCityRoutes = search.multicityRoutes?.every((multiCityRoute) =>
				multiCityRoute.departureDate ? new Date(multiCityRoute.departureDate) >= today : false
			);

			return isValidRoute || isValidMultiCityRoutes;
		});

		// remove invalid search data
		localStorageHelper.setItem(localStorageKey.flight.lastSearch, filterValidSearches);

		state.lastSearches = filterValidSearches.reverse();
	}

	function clearLastSearch() {
		state.lastSearches = [];
		localStorageHelper.removeItem(localStorageKey.flight.lastSearch);
	}

	onMount(() => {
		getLastSearchData();
	});

	return {
		state,
		clearLastSearch
	};
}
