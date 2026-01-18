import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import dayjs from 'dayjs';
import { dashboardGudangService } from '@/services/dashboardGudangService';
import { get } from 'svelte/store';
import { page } from '$app/stores';

export function useSummaryShiftPage() {
	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedItem: null | any;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		startDate: string;
		endDate: string;
		initialized: boolean;
		isFirstFetch: boolean; // 🔑
	};

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedItem: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		startDate: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
		isLoading: false,
		searchTerm: '',
		initialized: false,
		isFirstFetch: true // 🔑
	});

	/* =====================================================
	   TRANSFORM DATA
	===================================================== */
	function transformItemData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			barcode_id: item.barcode_id,
			location: item.location,
			status: item.status,
			item_id: item.item_id,
			name: item.name,
			description: item.description,
			scan_by: item.scan_by,
			scan_date: item.scan_date
		}));
	}

	/* =====================================================
	   FETCH HANDLER (CALLED BY EFFECT ONLY)
	===================================================== */
	async function handleGetPaged(
		pageNumber = state.currentPage,
		searchTerm = state.searchTerm,
		overrideNullDate = false
	) {
		try {
			state.isLoading = true;

			const res: any = await dashboardGudangService.getPagedDetailBarcode({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				Start: overrideNullDate ? 'NULL' : state.startDate,
				End: overrideNullDate ? 'NULL' : state.endDate,
				Status: 'GUDANG'
			});

			if (res?.data?.data) {
				state.table = transformItemData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
				state.totalPages = 0;
				state.totalCount = 0;
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to load Stock data');
			state.table = [];
		} finally {
			state.isLoading = false;
		}
	}

	/* =====================================================
	   SINGLE FETCH CONTROLLER (ANTI BLINK)
	===================================================== */
	let debounceTimer: any;
	$effect(() => {
		if (!state.initialized) return;
		if (!state.startDate || !state.endDate) return;

		if (debounceTimer) clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			if (state.isFirstFetch) {
				handleGetPaged(state.currentPage, state.searchTerm, true); // 🔥 NULL
				state.isFirstFetch = false;
			} else {
				handleGetPaged(state.currentPage, state.searchTerm);
			}
		}, 300);
	});

	/* =====================================================
	   LIFECYCLE: READ PARAMS FIRST
	===================================================== */
onMount(() => {
	const pageStore = get(page);
	const params = pageStore.url.searchParams;

	const start = params.get('Start');
	const end = params.get('End');

	if (start && end) {
		state.startDate = start;
		state.endDate = end;
		state.currentPage = 1;
	}

	state.initialized = true;
});


	/* =====================================================
	   ACTION HANDLERS (STATE ONLY)
	===================================================== */
	function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
	}

	function handleSearch(term: string) {
		state.searchTerm = term;
		state.currentPage = 1;
	}

	function handleDateFilter(startDate: string, endDate: string) {
		state.startDate = startDate;
		state.endDate = endDate;
		state.currentPage = 1;
	}

	function handleClearSearch() {
		state.searchTerm = '';
		state.currentPage = 1;
		state.showSearch = false;
	}

	return {
		state,
		handlePageChange,
		handleSearch,
		handleDateFilter,
		handleClearSearch,
		handleGetPaged
	};
}
