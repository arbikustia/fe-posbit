type FilterTrainState = {
	open: boolean;
};

export function useFilterTrain() {
	const state = $state<FilterTrainState>({
		open: false
	});

	return { state };
}
