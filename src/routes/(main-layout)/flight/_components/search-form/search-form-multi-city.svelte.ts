type SearchFormMultiCityState = {
	hasSwitch: boolean[];
};

export function useSearchFormMultiCity() {
	const state = $state<SearchFormMultiCityState>({
		hasSwitch: []
	});

	return {
		state
	};
}
