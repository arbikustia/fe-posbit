import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import { companyService } from '$lib/services/companyService';
import type { Company } from '$lib/types/Company';
import { onMount, tick } from 'svelte';

type SelectCompanyState = {
	isOpenList: boolean;
	items: Company[];
	displayedItems: Company[];
	keyword: string;
	limit: number;
	offset: number;
	loading: boolean;
	triggerRef: HTMLButtonElement;
	searchTimeout: NodeJS.Timeout | null;
};

export function useSelectCompany() {
	let state = $state<SelectCompanyState>({
		isOpenList: false,
		items: [],
		displayedItems: [],
		keyword: '',
		limit: 30,
		offset: 0,
		loading: false,
		triggerRef: null!,
		searchTimeout: null
	});

	function getSelectedDisplay(value: string, showSelectedCode?: boolean) {
		if (state.items.length === 0) {
			return '';
		}
		let item = state.items.find((f) => f.code === value);
		if (value === '') {
			return '';
		}
		return item ? `${showSelectedCode ? item.displayLabel : item.name}` : '';
	}

	async function loadData() {
		let data: Company[] = [];
		const localStorageData = localStorageHelper.getItem<Company[]>(
			localStorageKey.autoComplete.company
		);
		if (localStorageData) {
			data = localStorageData;
		} else {
			data = await companyService.getAll();
			localStorageHelper.setItem(localStorageKey.autoComplete.company, data);
		}
		state.items = data;

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

		const filtered = state.items.filter((item) => {
			const matched =
				item.code.toLowerCase().includes(searchLower) ||
				item.name.toLowerCase().includes(searchLower) ||
				item.displayLabel.toLocaleLowerCase().includes(searchLower);
			return matched;
		});

		state.displayedItems = [];
		state.offset = 0;
		state.loading = false;

		if (filtered.length === 0) {
			state.loading = false;
		} else {
			loadMore(filtered);
		}
	}

	function loadMore(data?: Company[]): void {
		if (state.loading) return;
		state.loading = true;

		const source = data || state.items;
		if (state.offset >= source.length) {
			state.loading = false;
			return;
		}

		state.displayedItems = [
			...state.displayedItems,
			...source.slice(state.offset, state.offset + state.limit)
		];
		state.offset += state.limit;
		state.loading = false;
	}

	function handleScroll(event: Event): void {
		const target = event.target as HTMLElement;
		if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
			loadMore();
		}
	}

	function closeAndFocusTrigger() {
		state.isOpenList = false;
		// tick().then(() => {
		// 	state.triggerRef.focus();
		// });
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
		getSelectedDisplay,
		handleSearchDebounce,
		resetList,
		closeAndFocusTrigger,
		handleScroll
	};
}
