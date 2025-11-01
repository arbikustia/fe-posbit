import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { salesSchema } from '../_components/form/schema';
import { saleService } from '@/services/saleService';

export function useSalesPage() {
	const form = superForm(defaults(zod(salesSchema)), {
		SPA: true,
		validators: zod(salesSchema),
		dataType: 'json',
		resetForm: false
	});

	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedSale: null | any;
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
		selectedSale: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: ''
	});

	// 🔹 Transform data dari API ke bentuk table
	function transformSalesData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			item_id: item.item_id ?? '-',
			qty: item.qty ?? 0,
			sale_id: item.sale_id ?? '-',
			open: true
		}));
	}

	// 🔹 Pagination handler
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await saleService.getPagedReport({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				Start: '',
				End: ''
			});

			if (res?.data?.data) {
				state.table = transformSalesData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load sales data');
			state.table = [];
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 Pindah halaman
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	// 🔹 Submit form
	async function handleSubmit() {
		const result = await validateForm({ update: true });

		if (!result.valid) {
			toast.error('Please check your input');
			return;
		}

		const values = get(formData);

		const body = {
			item_id: values.item_id,
			qty: values.qty,
			sale_id: values.sale_id
		};

		try {
			if ((values as any).id) {
				await saleService.update({
					id: String((values as any).id),
					...body
				});
				toast.success('Sale updated successfully');
			} else {
				await saleService.create(body);
				toast.success('Sale created successfully');
			}

			goto('/master/sales');
		} catch (err) {
			toast.error('Failed to save sale');
		}
	}

	onMount(() => {
		handleGetPaged();

		const url = get(page).url;
		const qp = url.searchParams;
		const hasAny = qp.has('item_id') || qp.has('qty') || qp.has('sale_id') || qp.has('id');

		if (hasAny) {
			formData.update((f) => ({
				...f,
				item_id: qp.get('item_id') ?? (f as any).item_id,
				qty: qp.has('qty') ? Number(qp.get('qty')) : (f as any).qty,
				sale_id: qp.get('sale_id') ?? (f as any).sale_id,
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
