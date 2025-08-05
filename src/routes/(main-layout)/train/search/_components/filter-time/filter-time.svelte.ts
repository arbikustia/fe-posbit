type FilterTimeState = {
	open: boolean;
};

export function useFilterTime() {
	const state = $state<FilterTimeState>({
		open: false
	});

	return { state };
}
