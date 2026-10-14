// useSalesPage.ts
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { salesSchema } from '../_components/form/schema';
import { saleService } from '@/services/saleService';
import dayjs from 'dayjs';

export function useSalesPage() {
	const form = superForm(defaults(zod(salesSchema)), {
		SPA: true,
		validators: zod(salesSchema),
		dataType: 'json',
		resetForm: false
	});

	type StateProps = {
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
		startDate: string,
		endDate: string,
	};

	const { form: formData, validateForm, errors } = form;

	const state = $state<StateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedSale: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
		totalCount: 0,
		isLoading: false,
		searchTerm: ''
	});

	// ✅ Transform sales data dari API
	function transformSalesData(apiData: any[]) {
		return apiData.map((item, index) => {
			// Check if this row was previously open (untuk preserve state saat pagination)
			const existingRow = state.table.find((r) => r.id === item.id);

			return {
				no: index + 1 + (state.currentPage - 1) * state.pageSize,
				id: item.id ?? `temp-${index}`,
				transaction_code: item.transaction_code ?? '-',
				customer_name: item.customer.customer_name ?? 'Walk-in Customer',
				cashier: item.cashier ?? '-',
				total_amount: item.total_amount ?? 0,
				final_amount: item.final_amount ?? 0,
				discount_amount: item.discount_amount ?? 0,
				payment_method: item.payment_method ?? 'CASH',
				amount_receive: item.amount_receive ?? 0,
				change: item.chance ?? 0,
				created_at: item.created_at ?? '-',
				details: (item.details || []).map((detail: any) => ({
					name: detail.name,
					item_id: detail.item_id,
					qty: detail.qty ?? detail.quantity ?? 0,
					price: detail.price ?? 0,
					discount: detail.discount ?? 0,
					subtotal: Math.max(
						(detail.qty ?? detail.quantity ?? 0) * (detail.price ?? 0) - (detail.discount ?? 0),
						0
					)
				})),
				// PENTING: Default FALSE, hanya preserve jika row sudah ada sebelumnya
				open: existingRow ? existingRow.open : false
			};
		});
	}

	// ✅ Toggle row details
	function toggleRow(id: string) {
		console.log('Toggle row called for id:', id);
		const rowBefore = state.table.find(r => r.id === id);
		console.log('Row before toggle:', rowBefore?.open);

		state.table = state.table.map((row) =>
			row.id === id ? { ...row, open: !row.open } : row
		);

		const rowAfter = state.table.find(r => r.id === id);
		console.log('Row after toggle:', rowAfter?.open);
	}

	$effect(() => {
		(async () => {
			await handleGetPaged(1, state.searchTerm);
		})();
	});

	// ✅ Get paginated sales data
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await saleService.getPagedReport({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				Start: state.startDate,
				End: state.endDate
			});

			if (res?.data?.data) {
				state.table = transformSalesData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
				console.warn('No sales data received');
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load sales data');
			state.table = [];
		} finally {
			state.isLoading = false;
		}
	}

	// ✅ Handle page change
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	// ✅ Handle search
	async function handleSearch(searchTerm: string) {
		state.searchTerm = searchTerm;
		state.currentPage = 1; // Reset to first page
		await handleGetPaged(1, searchTerm);
	}

	// ✅ Submit form (for create/update if needed)
	async function handleSubmit() {
		const result = await validateForm({ update: true });

		if (!result.valid) {
			toast.error('Please check your input');
			console.error('Validation errors:', get(errors));
			return;
		}

		const values: any = get(formData);

		const body = {
			customer_id: values.customer_id,
			total_amount: values.total_amount ?? 0,
			final_amount: values.final_amount ?? 0,
			discount_amount: values.discount_amount ?? 0,
			payment_method: values.payment_method ?? 'CASH',
			amount_receive: values.amount_receive ?? 0,
			details: values.details ?? []
		};

		try {
			state.isLoading = true;

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

			goto('/sales/report');
		} catch (err: any) {
			console.error('Failed to save sale:', err);
			const errorMsg = err?.response?.data?.message || 'Failed to save sale';
			toast.error(errorMsg);
		} finally {
			state.isLoading = false;
		}
	}

	// ✅ Handle delete sale
	async function handleDelete(saleId: string) {
		try {
			state.isLoading = true;
			await saleService.delete(saleId);
			toast.success('Sale deleted successfully');
			await handleGetPaged(); // Refresh table
			state.showDeleteModal = false;
			state.selectedSale = null;
		} catch (err: any) {
			console.error('Failed to delete sale:', err);
			const errorMsg = err?.response?.data?.message || 'Failed to delete sale';
			toast.error(errorMsg);
		} finally {
			state.isLoading = false;
		}
	}

	// ✅ Open delete modal
	function openDeleteModal(sale: any) {
		state.selectedSale = sale;
		state.showDeleteModal = true;
	}

	// ✅ Close delete modal
	function closeDeleteModal() {
		state.showDeleteModal = false;
		state.selectedSale = null;
	}

	async function handleDateFilter(startDate: string, endDate: string) {
		state.startDate = startDate;
		state.endDate = endDate;
		state.currentPage = 1; // Reset ke halaman 1 saat filter tanggal berubah

		// Data akan otomatis ter-refresh oleh $effect di atas
		console.log('Date filter applied:', startDate, endDate);
	}

	// ✅ Load sale for edit

	// ✅ ON MOUNT - Initialize data
	onMount(() => {
		handleGetPaged();

		const url = get(page).url;
		const saleId = url.searchParams.get('id');

	});

	return {
		state,
		form,
		errors,
		handleSubmit,
		handleGetPaged,
		handlePageChange,
		handleSearch,
		handleDelete,
		openDeleteModal,
		closeDeleteModal,
		toggleRow,
		handleDateFilter
	};
}