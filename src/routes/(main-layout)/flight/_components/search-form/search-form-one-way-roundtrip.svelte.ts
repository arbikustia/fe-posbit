type SearchFormOneWayRoundTripState = {
	hasSwitch: boolean;
};

export function useSearchFormOneWayRoundtrip() {
	const state = $state<SearchFormOneWayRoundTripState>({
		hasSwitch: false
	});

	return {
		state
	};
}
