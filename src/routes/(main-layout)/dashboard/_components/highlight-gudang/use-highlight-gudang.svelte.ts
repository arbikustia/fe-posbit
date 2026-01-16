import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import dayjs from 'dayjs';
import { dashboardGudangService } from '@/services/dashboardGudangService';
import { get } from 'svelte/store';
import { page } from '$app/stores';

export function useDashboardInventory() {
	type stateProps = {
		list: any;
		isLoading: boolean;
		startDate: string;
		endDate: string;
		popoverOpenGudang: boolean;
		initialized: boolean;
	};

	const state = $state<stateProps>({
		list: {},
		startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
		isLoading: false,
		popoverOpenGudang: false,
		initialized: false
	});

	async function handleGetPaged() {
		try {
			state.isLoading = true;

			const res: any = await dashboardGudangService.getDashboardInventory({
				Start: state.startDate,
				End: state.endDate
			});

			if (res.data.data) {
				console.log('Dashboard Inventory data:', res.data.data);
				state.list = res.data.data;
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load Stock data');
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 ✅ FUNGSI BARU: Handle date filter change
	async function handleDateFilter(startDate: string, endDate: string) {
		state.startDate = startDate;
		state.endDate = endDate;
	}

	onMount(() => {
		const pageStore = get(page);
		const params = pageStore.url.searchParams;

		const start = params.get('Start');
		const end = params.get('End');

		if (start && end) {
			state.startDate = start;
			state.endDate = end;
		}

		// tandai sudah siap
		state.initialized = true;
	});

	$effect(() => {
		if (!state.initialized) return;

		if (state.startDate && state.endDate) {
			handleGetPaged();
		}
	});

	onMount(() => {
		const pageStore = get(page); // ✅ OK
		const params = pageStore.url.searchParams;

		const start = params.get('Start');
		const end = params.get('End');

		if (start && end) {
			state.startDate = start;
			state.endDate = end;
			handleGetPaged();
		} else {
			handleGetPaged();
		}
	});

	return {
		state,
		handleDateFilter
	};
}
