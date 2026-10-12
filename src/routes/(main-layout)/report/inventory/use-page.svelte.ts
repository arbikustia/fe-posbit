import { toast } from 'svelte-sonner';
import { inventoryReportService, type InventoryReport } from '@/services/inventoryReportService';
import dayjs from 'dayjs';

export function useInventoryReportPage() {
	type stateProps = {
		table: InventoryReport[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		startDate: string;
		endDate: string;
	};

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
		isLoading: false,
		searchTerm: ''
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	// 🔹 Refresh saat search / tanggal berubah
	$effect(() => {
		state.searchTerm;
		if (!state.startDate || !state.endDate) return;

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			handleGetPaged(1, state.searchTerm);
		}, 300);
	});

	// 🔹 Pagination handler - include date filter
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await inventoryReportService.getPaged({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				startDate: state.startDate,
				endDate: state.endDate
			});

			if (res?.data?.data) {
				state.table = res.data.data;
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
			toast.error('Failed to load inventory data');
			state.table = [];
			state.totalPages = 0;
			state.totalCount = 0;
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 Ganti halaman
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	return {
		state,
		handleGetPaged,
		handlePageChange
	};
}
