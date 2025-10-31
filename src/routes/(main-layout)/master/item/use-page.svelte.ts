import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { masterItemSchema } from './_components/schema';
import { itemService } from '@/services/itemService';

export function useMasterItemPage() {
	const form = superForm(defaults(zod(masterItemSchema)), {
		SPA: true,
		validators: zod(masterItemSchema),
		dataType: 'json',
		resetForm: false
	});

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
	};

	const { form: formData, validateForm, errors } = form;

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
		isLoading: false,
		searchTerm: ''
	});

	// 🔹 Transform data dari API ke bentuk table
	function transformItemData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			nama_barang: item.nama_barang ?? '-',
			deskripsi: item.deskripsi ?? '-',
			qty_stok_toko: item.qty_stok_toko ?? 0,
			harga_beli: item.harga_beli ?? 0,
			harga_jual: item.harga_jual ?? 0,
			qty: item.qty ?? 0,
			open: true
		}));
	}
	let debounceTimer: NodeJS.Timeout;

	// 🔹 Efek: pencarian otomatis
	$effect(() => {
		(async () => {
			await handleGetPaged(1, state.searchTerm);
		})();
	});

	// 🔹 Pagination handler
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await itemService.getPagedItemToko({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm
			});

			if (res?.data?.data) {
				state.table = transformItemData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load master items');
			state.table = [];
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

	// 🔹 Submit handler
	async function handleSubmit() {
		try {
			const result = await validateForm({ update: true });
			if (!result.valid) {
				toast.error('Please check your input');
				return;
			}

		} catch (err) {
			console.error('Failed to save item:', err);
			toast.error('Failed to save item');
		}
	}

	onMount(() => {
		handleGetPaged();

		const url = get(page).url;
		const qp = url.searchParams;
		const hasAny =
			qp.has('nama_barang') ||
			qp.has('deskripsi') ||
			qp.has('qty_stok_toko') ||
			qp.has('harga_beli') ||
			qp.has('harga_jual') ||
			qp.has('qty') ||
			qp.has('id');

		if (hasAny) {
			formData.update((f) => ({
				...f,
				nama_barang: qp.get('nama_barang') ?? f.nama_barang,
				deskripsi: qp.get('deskripsi') ?? f.deskripsi,
				qty_stok_toko: qp.has('qty_stok_toko') ? Number(qp.get('qty_stok_toko')) : f.qty_stok_toko,
				harga_beli: qp.has('harga_beli') ? Number(qp.get('harga_beli')) : f.harga_beli,
				harga_jual: qp.has('harga_jual') ? Number(qp.get('harga_jual')) : f.harga_jual,
				qty: qp.has('qty') ? Number(qp.get('qty')) : f.qty,
				id: qp.get('id') ?? (f as any).id
			}));
		}
	});

	return {
		state,
		form,
		errors,
		handleSubmit,
		handleGetPaged,
		handlePageChange
	};
}
