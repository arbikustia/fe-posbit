type FilterClassState = {
	open: boolean;
};

export function useFilterClass() {
	const state = $state<FilterClassState>({
		open: false
	});

	return { state };
}
