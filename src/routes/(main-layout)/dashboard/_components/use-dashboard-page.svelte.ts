import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import dayjs from 'dayjs';
import { dashboardService } from '@/services/dashboardService';

export function useDashboardPage() {
	type SummaryData = {
		total_sale: number;
		total_tTransaction: number;
		new_customer: number;
		top_five: any[];
	};

	type ChartData = {
		labels: string[];
		values: number[];
	};

	type StateProps = {
		summary: SummaryData | null;
		chart: ChartData | null;
		isLoading: boolean;
		startDate: string;
		endDate: string;
		filter: string;
		popoverOpen:boolean
	};

	const state = $state<StateProps>({
		summary: null,
		chart: null,
		isLoading: false,
		startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
		filter: 'hari',
		popoverOpen:false
	});

	// 🔹 Get summary
	async function handleGetSummary(start: string, end: string) {
		try {
			state.isLoading = true;
			const res: any = await dashboardService.getSummary({ Start: start, End: end });

			if (res?.data?.status && res.data.data) {
				state.summary = res.data.data;
			} else {
				state.summary = null;
				toast.error('Data summary tidak ditemukan');
			}
		} catch (err) {
			console.error('Gagal memuat summary:', err);
			toast.error('Gagal memuat data summary');
			state.summary = null;
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 Get chart
	async function handleGetChart(start: string, end: string, filter: string) {
		try {
			state.isLoading = true;
			const res: any = await dashboardService.getChart({ Start: start, End: end, Filter: filter });

			if (res?.data?.status && res.data.data) {
				state.chart = res.data.data;
			} else {
				state.chart = null;
				toast.error('Data chart tidak ditemukan');
			}
		} catch (err) {
			console.error('Gagal memuat chart:', err);
			toast.error('Gagal memuat data chart');
			state.chart = null;
		} finally {
			state.isLoading = false;
		}
	}

	onMount(async () => {
		// 🔹 Saat pertama kali load halaman → ambil data 1 bulan ini
		await handleGetSummary(state.startDate, state.endDate);
		await handleGetChart(state.startDate, state.endDate, state.filter);
	});

	return {
		state,
		handleGetSummary,
		handleGetChart
	};
}
