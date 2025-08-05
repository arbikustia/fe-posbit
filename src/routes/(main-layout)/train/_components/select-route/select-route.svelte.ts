type SelectRouteState = {
	hasSwitch: boolean;
};

export function useSelectRoute() {
	const state = $state<SelectRouteState>({
		hasSwitch: false
	});

	return {
		state
	};
}
