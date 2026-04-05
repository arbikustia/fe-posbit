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
	};

	const state = $state<StateProps>({
		table: [],
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: ''
	});

	function transformData(apiData: any[]) {
		return apiData.map((item, index) => {
			const rowKey = `${item.inv_number ?? ''}_${item.item_id ?? ''}_${index}`;
			const existingRow = state.table.find((r) => r.rowKey === rowKey);

			return {
				rowKey,
				no: index + 1 + (state.currentPage - 1) * state.pageSize,
				inv_number: item.inv_number ?? '-',
				supplier: item.supplier ?? '-',
				item_id: item.item_id ?? '-',
				nama_barang: item.nama_barang ?? '-',
				deskripsi: item.deskripsi ?? '-',
				qty: item.qty ?? 0,
				sisa: item.sisa ?? 0,
				details: existingRow ? existingRow.details : [],
				isLoadingDetails: false,
				open: existingRow ? existingRow.open : false
			};
		});
	}

	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;
			const res: any = await purchaseService.getPagedSumPo({
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
			console.error('Failed to load summary PO:', err);
			toast.error('Failed to load stock monitoring data');
		} finally {
			state.isLoading = false;
		}
	}

	// rowKey: identifier unik per baris, item_id: untuk query API detail
	async function toggleRow(rowKey: string, itemId: string) {
		const row = state.table.find((r) => r.rowKey === rowKey);
		if (!row) return;

		row.open = !row.open;

		if (row.open && row.details.length === 0) {
			try {
				row.isLoadingDetails = true;
				const res: any = await purchaseService.getPagedSumPoDetail({
					PageNumber: 1,
					PageSize: 100,
					SearchTerm: '',
					ItemId: itemId
				});

				if (res?.data?.status) {
					row.details = res.data.data;
				}
			} catch (err) {
				console.error('Failed to load details:', err);
				toast.error('Failed to load item details');
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

	async function handleSearch(searchTerm: string) {
		state.searchTerm = searchTerm;
		state.currentPage = 1;
		await handleGetPaged(1, searchTerm);
	}

	onMount(() => {
		handleGetPaged();
	});

	return {
		state,
		handlePageChange,
		handleSearch,
		toggleRow,
		handleGetPaged
	};
}
