import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import { purchaseService } from '@/services/purchaseService';

export function useMonitoringPage() {
	type StateProps = {
		table: any[];
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
	};

	const state = $state<StateProps>({
		table: [],
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: '',
		showSearch: false,
		searchEl: null
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	// 🔹 Efek: pencarian otomatis
	$effect(() => {
		const term = state.searchTerm;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			await handleGetPaged(1, term);
		}, 300);
	});

	function transformData(apiData: any[]) {
		return apiData.map((item, index) => {
			const rowKey = `${item.item_id ?? ''}_${index}`;
			const existingRow = state.table.find((r) => r.rowKey === rowKey);

			return {
				rowKey,
				no: index + 1 + (state.currentPage - 1) * state.pageSize,
				transaction_number: item.transaction_number ?? item.inv_number ?? '-',
				item_id: item.item_id ?? '-',
				nama_barang: item.nama_barang ?? item.name ?? '-',
				deskripsi: item.deskripsi ?? item.description ?? '-',
				qty: item.qty ?? 0,
				remarks: item.remarks ?? '-',
				location: item.location ?? '-',
				from: item.from ?? '-',
				to: item.to ?? '-',
				scan_by: item.scan_by ?? '-',
				created_date: item.created_date ?? item.date ?? '-',
				details: existingRow ? existingRow.details : [],
				isLoadingDetails: false,
				open: existingRow ? existingRow.open : false
			};
		});
	}

	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;
			const res: any = await purchaseService.getPagedMonitoring({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm
			});

			if (res?.data?.status) {
				state.table = transformData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Failed to load total barang masuk:', err);
			toast.error('Failed to load data');
		} finally {
			state.isLoading = false;
		}
	}

	async function toggleRow(rowKey: string, itemId: string) {
		const row = state.table.find((r) => r.rowKey === rowKey);
		if (!row) return;

		row.open = !row.open;

		if (row.open && row.details.length === 0) {
			try {
				row.isLoadingDetails = true;
				const res: any = await purchaseService.getPagedMonitoringDetail({
					PageNumber: 1,
					PageSize: 1000,
					SearchTerm: '',
					ItemId: itemId
				});

				if (res?.data?.status) {
					row.details = res.data.data;
				}
			} catch (err) {
				console.error('Failed to load details:', err);
				toast.error('Failed to load monitoring details');
			} finally {
				row.isLoadingDetails = false;
			}
		}
	}

	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	onMount(() => {
		handleGetPaged();
	});

	return {
		state,
		handlePageChange,
		toggleRow,
		handleGetPaged
	};
}
