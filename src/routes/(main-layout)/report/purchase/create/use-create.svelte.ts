// usePurchasePage.ts
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { purchaseService } from '@/services/purchaseService';
import { itemService } from '@/services/itemService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { browser } from '$app/environment';
import dayjs from 'dayjs';

export function usePurchasePage() {
	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedPurchase: null | any;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		paymentStatus: string;
		statusPo: string;
		startDate: string;
		endDate: string;
		filter: {};
		popoverOpen: false;
		isEditing: boolean;
		listItem: {
			value: string;
			label: string;
			stock: number;
			deskripsi: string;
			kode_barang: string;
			harga: number;
			harga_a: number;
			harga_b: number;
			harga_c: number;
			harga_d: number;
			harga_e: number;
			harga_f: number;
		}[];
		poLogIncreaseItem: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogDecreaseItem: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogIncreaseQty: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogDecreaseQty: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		detailFromParams: any[];
		allData: any[];
		originalData: any[]; // Data asli dari API sebelum difilter
	};

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedPurchase: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: '',
		paymentStatus: '',
		statusPo: '',
		startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
		filter: {},
		popoverOpen: false,
		isEditing: false,
		listItem: [],
		poLogIncreaseItem: [],
		poLogDecreaseItem: [],
		poLogIncreaseQty: [],
		poLogDecreaseQty: [],
		detailFromParams: [],
		allData: [],
		originalData: [] // Data asli dari API
	});

	// Fetch items from gudang
	async function handleGetListItemGudang() {
		try {
			state.isLoading = true;
			const res: any = await itemService.getListitemGudang();

			state.listItem =
				res?.data?.data?.map((item: any, index: number) => ({
					value: item.kode_barang ?? `item-${index}`,
					label: item.nama_barang ?? 'Unknown Item',
					stock: item.jumlah ?? 0,
					deskripsi: item.deskripsi ?? '',
					kode_barang: item.kode_barang ?? '',
					harga: item.harga ?? 0,
					harga_a: item.harga_a ?? item.harga,
					harga_b: item.harga_b ?? item.harga,
					harga_c: item.harga_c ?? item.harga,
					harga_d: item.harga_d ?? item.harga,
					harga_e: item.harga_e ?? item.harga,
					harga_f: item.harga_f ?? item.harga
				})) || [];
		} catch (err) {
			console.error('Failed to fetch gudang items:', err);
			toast.error('Failed to load items from gudang');
			state.listItem = [];
		} finally {
			state.isLoading = false;
		}
	}

	function transformPurchaseData(apiData: any[]) {
		return apiData.map((item, index) => ({
			no: index + 1,
			id: item.id ?? '-',
			inv_number: item.inv_number ?? '-',
			person_id: item.person_id ?? '-',
			customer_name: `${item.person?.firstname ?? '-'} ${item.person?.lastname ?? ''}`.trim(),
			customer_code: item.person?.supliercustomerid ?? '-',
			telephone: item.person?.telephone ?? '-',
			mobile: item.person?.mobile ?? '-',
			person_type: item.person?.type ?? 'Customer',
			payment_status: item.payment_status ?? '-',
			status_po: item.status_po ?? '-',
			total_amount: item.total_amount ?? 0,
			final_amount: item.final_amount ?? 0,
			biaya_label: item.biaya_label ?? 0,
			down_payment: item.down_payment ?? 0,
			payment_method: item.payment_method ?? '-',
			package_id: item.package_id ?? '-',
			package_name: item.package_name ?? '-',
			created_at: item.created_at ?? '-',
			created_by: item.created_by ?? '-',
			keterangan: item.keterangan ?? '',
			label: item.label ?? 0,
			ongkir: item.ongkir ?? 0,
			purchase_order_details: item.purchase_order_details ?? [],
			log_po: item.log_po ?? [],
			open: true
		}));
	}

	// Fungsi untuk memfilter data di frontend
	function filterData(data: any[], searchTerm: string) {
		if (!searchTerm.trim()) return data;

		const term = searchTerm.toLowerCase();
		return data.filter(
			(item) =>
				item.inv_number?.toLowerCase().includes(term) ||
				item.customer_name?.toLowerCase().includes(term) ||
				item.customer_code?.toLowerCase().includes(term) ||
				item.telephone?.toLowerCase().includes(term) ||
				item.mobile?.toLowerCase().includes(term) ||
				item.payment_status?.toLowerCase().includes(term) ||
				item.status_po?.toLowerCase().includes(term) ||
				item.payment_method?.toLowerCase().includes(term) ||
				item.keterangan?.toLowerCase().includes(term)
		);
	}

	// Fungsi untuk apply pagination ke data yang sudah difilter
	function applyPagination(data: any[], pageNumber: number, pageSize: number) {
		const startIndex = (pageNumber - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return data.slice(startIndex, endIndex);
	}

	// Fungsi untuk update table berdasarkan data yang ada
	function updateTable() {
		let filteredData = state.originalData;

		// Apply status filter
		if (state.paymentStatus) {
			filteredData = filteredData.filter((p) => p.payment_status === state.paymentStatus);
		}
		if (state.statusPo) {
			filteredData = filteredData.filter((p) => p.status_po === state.statusPo);
		}

		// Apply search filter
		filteredData = filterData(filteredData, state.searchTerm);

		// Simpan ke allData
		state.allData = filteredData;

		// Update pagination info
		state.totalCount = filteredData.length;
		state.totalPages = Math.ceil(filteredData.length / state.pageSize);

		// Ensure current page is valid
		if (state.currentPage > state.totalPages && state.totalPages > 0) {
			state.currentPage = state.totalPages;
		} else if (state.totalPages === 0) {
			state.currentPage = 1;
		}

		// Apply pagination
		state.table = applyPagination(filteredData, state.currentPage, state.pageSize);
	}

	async function handleGetPaged(
		pageNumber = 1,
		searchTerm = state.searchTerm,
		startDate = state.startDate,
		endDate = state.endDate
	) {
		try {
			state.isLoading = true;
			const res: any = await purchaseService.getPaged({
				PageNumber: pageNumber, // Ambil semua data
				PageSize: state.pageSize, // Ambil data dalam jumlah besar
				SearchTerm: '', // Tidak pakai search di backend
				PaymentStatus: state.paymentStatus,
				StatusPo: state.statusPo,
				StartDate: startDate,
				EndDate: endDate
			});

			if (res?.data?.status) {
				state.totalPages = res.data.total_pages;
				state.totalCount = res.data.total_count;
				const transformed = transformPurchaseData(res.data.data);

				// Simpan data asli
				state.table = transformed;

				// Update table dengan data yang baru
			} else {
				state.originalData = [];
				state.allData = [];
				state.totalCount = 0;
				state.totalPages = 0;
				state.currentPage = 1;
			}
		} catch (err) {
			state.originalData = [];
			state.allData = [];
			state.totalCount = 0;
			state.totalPages = 0;
			state.currentPage = 1;
		} finally {
			state.isLoading = false;
		}
	}

	// Fungsi untuk handle search di frontend
	function handleSearch(searchTerm: string) {
		state.searchTerm = searchTerm;
		state.currentPage = 1; // Reset ke page 1 saat search

		// Update table dengan filter search baru
	}

	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;

		state.currentPage = pageNum;
		handleGetPaged(pageNum, state.searchTerm);
	}
	$effect(() => {
		(async () => {
			if (state.searchTerm) {
				handleGetPaged(1, state.searchTerm);
			}
		})();
	});

	    let debounceTimer: NodeJS.Timeout;

	$effect(() => {
		// Hanya jalankan jika startDate dan endDate sudah terisi
		if (state.startDate && state.endDate) {
			console.log('Date range changed, refreshing data...', state.startDate, state.endDate);

			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			debounceTimer = setTimeout(() => {
				handleGetPaged(1, state.searchTerm);
			}, 300);
		}
	});

	onMount(() => {
		handleGetPaged();
		handleGetListItemGudang();
	});

	return {
		state,
		handleGetPaged,
		handlePageChange,
		handleGetListItemGudang,
		handleSearch
	};
}
