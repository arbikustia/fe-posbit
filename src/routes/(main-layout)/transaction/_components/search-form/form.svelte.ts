import { toast } from 'svelte-sonner';
import { customerService } from '@/services/customerService';
import { itemService } from '@/services/itemService';
import dayjs from 'dayjs';
import { onMount } from 'svelte';

export function useTransactionForm() {
	const state = $state<any>({
		customerName: '',
		customerNumber: 0,
		searchProduct: '',
		amount: 0,
		discount: 0,
		currentTime: dayjs().format('DD-MM-YYYY HH:mm:ss'),
		paymentMethod: 'CASH',
		paymentMethodeOpen: false,
		customerData: null,
		username: '',

		// 🔹 Item data & pagination
		itemTable: [],
		isLoading: false,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		searchTerm: ''
	});

	// 🔹 Transformasi data item dari API
	function transformItemData(apiData: any[]) {
		return apiData.map((item: any, index: number) => ({
			id: item.item_id || index + 1,
			barcode_id: item.barcode_id,
			item_id: item.item_id,
			name: item.name,
			label_name: item.label_name,
			harga_jual: Number(item.harga_jual) || 0
		}));
	}

	// 🔹 Ganti halaman
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetItemList(pageNum);
	}

	// 🔹 Effect: Auto-fetch item list saat search term berubah
	$effect(() => {
		(async () => {
			if (state.searchTerm) {
				await handleGetItemList(1, state.searchTerm);
			}
		})();
	});

	// 🔹 Effect: Fetch customer data jika nomor diinput
	$effect(() => {
		(async () => {
			if (state.customerNumber && state.customerNumber > 0) {
				try {
					const res = await customerService.getByNumber(state.customerNumber);
					if (res?.data?.status && res?.data?.data) {
						state.customerData = res.data.data;
						state.customerName = res.data.data.customer_name ?? '';
					} else {
						state.customerData = null;
					}
				} catch (err) {
					console.error('Error fetching customer:', err);
					state.customerData = null;
					toast.error('Customer not found');
				}
			}
		})();
	});


	async function handleGetItemList(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;
			console.log('Fetching with search term:', searchTerm); // debugging

			const res: any = await itemService.getListitemBarcode({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm?.trim() // pastikan tidak ada whitespace
			});

			// Reset table jika tidak ada hasil
			if (!res?.data?.data || res.data.data.length === 0) {
				state.itemTable = [];
				state.totalCount = 0;
				state.totalPages = 1;
				return;
			}

			state.itemTable = transformItemData(res.data.data);
			state.currentPage = res.data.page_number ?? pageNumber;
			state.totalPages = res.data.total_pages ?? 1;
			state.totalCount = res.data.total_count ?? state.itemTable.length;

		} catch (err) {
			console.error('Failed to fetch item list:', err);
			toast.error('Gagal memuat data item');
			state.itemTable = [];
		} finally {
			state.isLoading = false;
		}
	}

	// Perbaiki effect untuk search
	$effect(() => {
		const searchValue = state.searchTerm;
		const debounceTimer = setTimeout(async () => {
			if (searchValue !== undefined) {
				await handleGetItemList(1, searchValue);
			}
		}, 300); // debounce 300ms

		return () => clearTimeout(debounceTimer);
	});

	// Tambahkan fungsi untuk update search term
	function updateSearchTerm(term: string) {
		state.searchTerm = term;
		state.currentPage = 1; // Reset ke halaman pertama saat search
	}

	// 🔹 Initial load
	onMount(() => {
		handleGetItemList();
	});

	return {
		state,
		handleGetItemList,
		handlePageChange
	};
}
