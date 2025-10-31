import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '../_components/form/schema';
import { userService } from '$lib/services/userService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

export function useUserPage() {
	const form = superForm(defaults(zod(userSchema)), {
		SPA: true,
		validators: zod(userSchema),
		dataType: 'json',
		resetForm: false
	});

	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedUser: null | any;
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
		selectedUser: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: ''
	});

	// 🔹 Transform data dari API ke table
	function transformUserData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			username: item.username,
			password: item.password,
			role: item.role,
			email: item.email,
			last_created: item.last_created,
			open: true
		}));
	}

	// 🔹 Get data berdasarkan pageNumber dan search
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		try {
			state.isLoading = true;

			const res: any = await userService.getPaged({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm
			});

			if (res?.data?.data) {
				state.table = transformUserData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load users');
			state.table = [];
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 Fungsi untuk pindah halaman
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	// 🔹 Submit form (Create / Update)
	async function handleSubmit() {
		const result = await validateForm({ update: true });

		if (!result.valid) {
			toast.error('Please check your input');
			return;
		}

		const values = get(formData);
		const body = {
			username: values.userName,
			email: values.email,
			password: values.password,
			role: [values.role]
		};

		try {
			if ((values as any).id) {
				await userService.update({
					id: String((values as any).id),
					username: body.username,
					email: body.email,
					password: body.password,
					role: body.role
				});
				toast.success('User updated successfully');
			} else {
				await userService.create(body);
				toast.success('User created successfully');
			}

			goto('/master/user');
		} catch (err) {
			toast.error('Failed to save user');
		}
	}

	$effect(() => {
		(async () => {
				handleGetPaged(1, state.searchTerm);
		})();
	});

	onMount(() => {
		handleGetPaged(1, '');

		const url = get(page).url;
		const qp = url.searchParams;
		const hasAny =
			qp.has('username') || qp.has('email') || qp.has('role') || qp.has('id') || qp.has('password');

		if (hasAny) {
			formData.update((f) => ({
				...f,
				userName: qp.get('username') ?? f.userName,
				email: qp.get('email') ?? f.email,
				role: qp.get('role') ?? f.role,
				id: qp.get('id') ?? (f as any).id,
				password: qp.get('password') ?? f.password
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
