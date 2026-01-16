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
		initialized: false
	});

	/* =====================================================
	   TRANSFORM DATA
	===================================================== */
	function transformItemData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			stock_out_id: item.stock_out_id,
			transaction_number: item.transaction_number,
			transaction_date: item.transaction_date,
			location: item.location,
			from: item.from,
			to: item.to,
			item_id: item.item_id,
			qty: item.qty,
			remarks: item.remarks,
			scan_by: item.scan_by
		}));
	}

	/* =====================================================
	   FETCH HANDLER (ONLY CALLED BY EFFECT)
	===================================================== */
	async function handleGetPaged(
		pageNumber = state.currentPage,
		searchTerm = state.searchTerm
	) {
		try {
			state.isLoading = true;

			const res: any = await dashboardGudangService.getPagedOutCustomer({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				Start: state.startDate,
				End: state.endDate
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
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load Stock data');
			state.table = [];
			state.totalPages = 0;
			state.totalCount = 0;
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
			handleGetPaged(state.currentPage, state.searchTerm);
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

		state.initialized = true; // 🔑 allow fetch
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
		handleClearSearch
	};
}
