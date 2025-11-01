import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { customerSchema } from '../_components/form/schema';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { customerService } from '@/services/customerService';

export function useCustomerPage() {
	const form = superForm(defaults(zod(customerSchema)), {
		SPA: true,
		validators: zod(customerSchema),
		dataType: 'json',
		resetForm: false
	});

	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedCustomer: null | any;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		typeFilter: string;
	};

	const { form: formData, validateForm, errors } = form;

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedCustomer: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: '',
		typeFilter: '' // <-- tambah ini
	});


	// 🔹 Transform data dari API ke bentuk table
	function transformCustomerData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			customer_name: item.customer_name,
			phone: item.phone,
			is_member: item.is_member,
			member_since: item.member_since,
			member_code: item.member_code ?? '',
			point: item.point,
			last_created: item.last_created,
			open: true
		}));
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

			const res: any = await customerService.getPaged({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm
			});

			if (res?.data?.data) {
				let transformed = transformCustomerData(res.data.data);

				// Apply type filter
				if (state.typeFilter) {
					transformed = transformed.filter(c =>
						state.typeFilter === 'PREMIUM' ? c.is_member : !c.is_member
					);
				}

				state.table = transformed;
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load customer');
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
		const result = await validateForm({ update: true });
		if (!result.valid) {
			toast.error('Please check your input');
			return;
		}

		const values = get(formData);
		const body = {
			customer_name: values.customer_name,
			phone: values.phone,
			is_member: values.is_member,
			member_since: values.member_since,
			member_code: values.member_code ?? '',
			point: Number(values.point),
			type: values.is_member ? 'PREMIUM' : 'REGULER'
		};

		try {
			if ((values as any).id) {
				await customerService.update({
					id: String((values as any).id),
					customer_name: body.customer_name,
					phone: body.phone,
					is_member: body.is_member,
					member_since: body.member_since,
					member_code: body.member_code,
					point: body.point,
					type: values.is_member ? 'PREMIUM' : 'REGULER'
				});
				toast.success('Customer updated successfully');
			} else {
				await customerService.create(body);
				toast.success('Customer created successfully');
			}

			goto('/master/customer');
		} catch (err) {
			toast.error('Failed to save customer');
		}
	}

	onMount(() => {
		handleGetPaged();

		const url = get(page).url;
		const qp = url.searchParams;
		const hasAny =
			qp.has('customer_name') ||
			qp.has('phone') ||
			qp.has('is_member') ||
			qp.has('member_since') ||
			qp.has('member_code') ||
			qp.has('point') ||
			qp.has('id');

		if (hasAny) {
			formData.update((f) => ({
				...f,
				customer_name: qp.get('customer_name') ?? f.customer_name,
				phone: qp.get('phone') ?? f.phone,
				is_member:
					qp.has('is_member') ? (qp.get('is_member') === 'true' || qp.get('is_member') === '1') : f.is_member,
				member_since: qp.get('member_since') ?? f.member_since,
				member_code: qp.get('member_code') ?? f.member_code ?? '',
				point: qp.has('point') ? Number(qp.get('point')) : f.point,
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
