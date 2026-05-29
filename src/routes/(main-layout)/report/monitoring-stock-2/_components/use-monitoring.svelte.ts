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
			return {
				no: index + 1 + (state.currentPage - 1) * state.pageSize,
				inv_number: item.inv_number ?? '-',
				supplier: item.supplier ?? '-',
				item_id: item.item_id ?? '-',
				nama_barang: item.nama_barang ?? '-',
				deskripsi: item.deskripsi ?? '-',
				qty: item.qty ?? 0,
				sisa: item.sisa ?? 0
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
			console.error('Failed to load monitoring stock:', err);
			toast.error('Failed to load stock monitoring data');
		} finally {
			state.isLoading = false;
		}
	}

	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	async function handleExport() {
		try {
			toast.info('Downloading file...');
			await purchaseService.getExportMonitoringStock({
				PageNumber: 1, 
				PageSize: state.pageSize,
				SearchTerm: state.searchTerm,
				IsExport: true
			});
			toast.success('Download completed successfully');
		} catch (err) {
			console.error('Failed to export data:', err);
			toast.error('Failed to export data');
		}
	}

	onMount(() => {
		handleGetPaged();
	});

	return {
		state,
		handlePageChange,
		handleGetPaged,
		handleExport
	};
}
