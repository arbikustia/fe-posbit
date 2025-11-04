import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { purchaseReportSchema } from '../_components/form/schema';
import { onMount } from 'svelte';
import { purchaseService } from '@/services/purchaseService';

export function usePurchaseReportPage() {
	const form = superForm(defaults(zod(purchaseReportSchema)), {
		SPA: true,
		validators: zod(purchaseReportSchema),
		dataType: 'json',
		resetForm: false
	});

	type PurchaseReportRow = {
		id: string;
		inv_number: string;
		person_name: string;
		item_name: string;
		qty: number;
		qty_keluar: number;
		status: string;
		total_amount: number;
		created_at: string;
		open?: boolean;
	};

	type StateProps = {
		table: PurchaseReportRow[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
	};

	const { form: formData, validateForm, errors } = form;

	const state = $state<StateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: ''
	});

	// 🔹 Transform data dari API ke bentuk table
	// Flatten purchase_order_details ke rows terpisah
	function transformPurchaseReportData(apiData: any[]): PurchaseReportRow[] {
		const rows: PurchaseReportRow[] = [];

		apiData.forEach((purchase) => {
			if (purchase.purchase_order_details && purchase.purchase_order_details.length > 0) {
				purchase.purchase_order_details.forEach((detail: any) => {
					rows.push({
						id: `${purchase.id}-${detail.item_id}`,
						inv_number: purchase.inv_number,
						person_name: purchase.person
							? `${purchase.person.firstname} ${purchase.person.lastname}`.trim()
							: '-',
						item_name: detail.name || detail.item_id,
						qty: detail.qty,
						qty_keluar: detail.qty_keluar,
						status: purchase.status,
						total_amount: purchase.final_amount || purchase.total_amount,
						created_at: purchase.created_at
							? new Date(purchase.created_at).toLocaleDateString('id-ID')
							: '-',
						open: true
					});
				});
			} else {
				// Jika tidak ada detail, tetap tampilkan purchase order
				rows.push({
					id: purchase.id,
					inv_number: purchase.inv_number,
					person_name: purchase.person
						? `${purchase.person.firstname} ${purchase.person.lastname}`.trim()
						: '-',
					item_name: '-',
					qty: 0,
					qty_keluar: 0,
					status: purchase.status,
					total_amount: purchase.final_amount || purchase.total_amount,
					created_at: purchase.created_at
						? new Date(purchase.created_at).toLocaleDateString('id-ID')
						: '-',
					open: true
				});
			}
		});

		return rows;
	}

	$effect(() => {
		(async () => {
			handleGetPaged(1, state.searchTerm);
		})();
	});

	// 🔹 Pagination handler
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await purchaseService.getPaged({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				Status: '',
				EndDate: '',
				StartDate: ''
			});

			if (res?.data?.data) {
				const transformed = transformPurchaseReportData(res.data.data);
				state.table = transformed;
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load purchase report');
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

	async function handleSubmit() {
		const result = await validateForm({ update: true });
		if (result.valid) {
			goto('/master/purchaseReport');
		} else {
			toast.error('Please check your input');
		}
	}

	onMount(() => {
		handleGetPaged();
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