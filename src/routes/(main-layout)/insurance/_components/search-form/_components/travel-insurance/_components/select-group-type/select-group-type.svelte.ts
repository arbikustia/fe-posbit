import { onMount } from 'svelte';

type SelectTripState = {
	isOpenList: boolean;
	displayedItems: any[];
	triggerRef: HTMLButtonElement | null;
	keyword: string;
	loading: boolean;
	searchTimeout: NodeJS.Timeout | null;
};

const dataOption = [
	{ value: 'Individual', label: 'Individual' },
	{ value: 'Duo', label: 'Duo' },
	{ value: 'Group', label: 'Group' },
	{ value: 'Family', label: 'Family' }
];

export function useSelectGroupType() {
	let state = $state<SelectTripState>({
		isOpenList: false,
		displayedItems: dataOption,
		triggerRef: null,
		keyword: '',
		loading: false,
		searchTimeout: null
	});

	function closeAndFocusTrigger() {
		state.isOpenList = false;
	}

	function getSelectedDisplay(value: string, showSelectedCode?: boolean) {
		const item = dataOption.find((f) => f.value.toLowerCase() === value.toLowerCase());
		if (value === '') return '';
		return item ? `${showSelectedCode ? item.label : item.label}` : '';
	}

	async function loadData() {
		state.displayedItems = dataOption;
		applySearch();
	}

	function handleSearchDebounce(): void {
		if (state.searchTimeout) clearTimeout(state.searchTimeout);
		state.searchTimeout = setTimeout(() => {
			applySearch();
		}, 300);
	}

	function applySearch(): void {
		const searchLower = state.keyword.toLowerCase().trim();

		const filtered = dataOption.filter((item) => {
			const matched =
				item.value?.toLowerCase().includes(searchLower) ||
				item.label?.toLowerCase().includes(searchLower);
			return matched;
		});

		state.displayedItems = filtered;
	}

	async function resetList() {
		await new Promise((resolve) => setTimeout(resolve, 300));
		state.keyword = '';
		applySearch();
	}

	onMount(() => {
		loadData();
	});

	return {
		state,
		closeAndFocusTrigger,
		getSelectedDisplay,
		handleSearchDebounce,
		resetList
	};
}
