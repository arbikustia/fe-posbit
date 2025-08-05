import providerList, { type ProviderList } from '$lib/types/ProviderList';

type AvailableProviders = {
	selected: boolean;
} & Pick<ProviderList, 'code' | 'name'>;

type PreferredProvidersState = {
	availableProviders: AvailableProviders[];
	isOpenList: boolean;
	triggerRef: HTMLButtonElement;
	isSelectedAll: boolean;
};

export function usePreferredProviders() {
	const state = $state<PreferredProvidersState>({
		availableProviders: [],
		isOpenList: false,
		triggerRef: null!,
		isSelectedAll: false
	});

	function init(value: number[]) {
		state.availableProviders = providerList.map((item) => {
			return {
				code: item.code,
				name: item.name,
				selected: value.includes(item.code)
			};
		});
	}

	function closeAndFocusTrigger() {
		state.isOpenList = false;
	}

	function displaySelected() {
		var selectedProvider = state.availableProviders.filter((item) => item.selected);
		if (
			selectedProvider.length == 0 ||
			selectedProvider.length == state.availableProviders.length
		) {
			return `Provider Preferences (${state.availableProviders.length})`;
		}

		if (selectedProvider.length == 1) {
			return `${selectedProvider[0].name} Only`;
		}
		return `${selectedProvider.length} Providers Selected`;
	}

	function handleSelectAll(setValue: () => void) {
		const isSelectedAll = state.availableProviders.every((item) => item.selected);
		state.availableProviders = [...state.availableProviders].map((item) => {
			return {
				...item,
				selected: !isSelectedAll
			};
		});

		setValue();
	}

	function reset(resetValue: () => void) {
		state.availableProviders = state.availableProviders.map((item) => ({
			...item,
			selected: false
		}));
		resetValue();
	}

	return {
		state,
		displaySelected,
		closeAndFocusTrigger,
		reset,
		init,
		handleSelectAll
	};
}
