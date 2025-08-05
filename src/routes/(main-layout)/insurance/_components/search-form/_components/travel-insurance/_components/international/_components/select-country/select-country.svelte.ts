import { onMount } from 'svelte';

type CountryOptions = {
	value: string;
	label: string;
};

type SelectTripState = {
	isOpenList: boolean;
	displayedItems: CountryOptions[];
	triggerRef: HTMLButtonElement | null;
	keyword: string;
	limit: number;
	offset: number;
	loading: boolean;
	searchTimeout: NodeJS.Timeout | null;
};

const dataOption = [
	{ value: 'indonesia', label: 'Indonesia' },
	{ value: 'malaysia', label: 'Malaysia' },
	{ value: 'singapore', label: 'Singapore' },
	{ value: 'thailand', label: 'Thailand' },
	{ value: 'vietnam', label: 'Vietnam' },
	{ value: 'philippines', label: 'Philippines' },
	{ value: 'japan', label: 'Japan' },
	{ value: 'south_korea', label: 'South Korea' },
	{ value: 'china', label: 'China' },
	{ value: 'india', label: 'India' },
	{ value: 'australia', label: 'Australia' }
];

export function useSelectCountry() {
	let state = $state<SelectTripState>({
		isOpenList: false,
		displayedItems: dataOption,
		triggerRef: null,
		keyword: '',
		limit: 30,
		offset: 0,
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
