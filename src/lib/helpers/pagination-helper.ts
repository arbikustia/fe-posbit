import { toast } from 'svelte-sonner';

/** Struktur state pagination */
export interface PaginationState<T> {
	data: T[];
	currentPage: number;
	pageSize: number;
	totalPages: number;
	totalCount: number;
	isLoading: boolean;
	searchTerm?: string;
}

/** Opsi konfigurasi pagination */
export interface PaginationOptions<T> {
	initialPage?: number;
	pageSize?: number;
	initialSearch?: string;
	fetcher: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm?: string;
	}) => Promise<{ data: { data: T[]; total_pages: number; total_count: number; page_number: number } }>;
	transformer?: (apiData: T[]) => any[];
}

/**
 * ✅ Reusable Pagination Helper
 * Cara pakai:
 * const { state, getPaged, nextPage, prevPage, goToPage } = usePagination({
 *    fetcher: userService.getPaged,
 *    transformer: (data) => data.map(x => ({ ...x, open: true }))
 * });
 */
export function usePagination<T>(options: PaginationOptions<T>) {
	const { fetcher, transformer } = options;

	const state = $state<PaginationState<T>>({
		data: [],
		currentPage: options.initialPage ?? 1,
		pageSize: options.pageSize ?? 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: options.initialSearch ?? ''
	});

	async function getPaged(pageNumber = state.currentPage, search = state.searchTerm) {
		try {
			state.isLoading = true;

			// 🔹 Pastikan SearchTerm selalu string agar cocok dengan tipe Axios service
			const res = await fetcher({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: search ?? ''
			});

			const payload = res?.data;
			if (payload?.data) {
				state.data = transformer ? transformer(payload.data) : payload.data;
				state.totalPages = payload.total_pages ?? 1;
				state.totalCount = payload.total_count ?? payload.data.length;
				state.currentPage = payload.page_number ?? pageNumber;
			} else {
				state.data = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load data');
			state.data = [];
		} finally {
			state.isLoading = false;
		}
	}

	async function goToPage(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		await getPaged(pageNum);
	}

	async function nextPage() {
		if (state.currentPage < state.totalPages) await goToPage(state.currentPage + 1);
	}

	async function prevPage() {
		if (state.currentPage > 1) await goToPage(state.currentPage - 1);
	}

	return {
		state,
		getPaged,
		goToPage,
		nextPage,
		prevPage
	};
}

/**
 * 🔧 Helper tambahan agar Axios-based API bisa digunakan tanpa type conflict.
 * Fungsi ini mengonversi Axios response ke bentuk Promise yang diharapkan `usePagination`.
 */
export function adaptAxiosFetcher<T>(
	apiFn: (params: { PageNumber: number; PageSize: number; SearchTerm: string }) => Promise<any>
) {
	return async (params: { PageNumber: number; PageSize: number; SearchTerm?: string }) => {
		const res = await apiFn({
			PageNumber: params.PageNumber,
			PageSize: params.PageSize,
			SearchTerm: params.SearchTerm ?? ''
		});
		return { data: res.data };
	};
}
