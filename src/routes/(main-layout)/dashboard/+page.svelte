<script lang="ts">
	import { HighlightCard } from './_components/highlight-card';
	import { ChartVisitors } from './_components/chart-visitors';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import dayjs from 'dayjs';
	import { useDashboardPage } from '../dashboard/_components/use-dashboard-page.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { onMount } from 'svelte';
	import { modalService } from '@/services/modalService';
	import { FormModalAwal } from './_components/form-modal-awal';
	
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	// ✅ Ambil semua state & handler langsung dari useDashboardPage
	const { state, handleGetSummary, handleGetChart } = useDashboardPage();
	let popoverOpen = false;
	
	// ✅ Ubah tanggal → update di state & fetch ulang data
	function handleDateChange(v: any) {
		console.log('Date changed:', v);
		
		// Cek apakah start dan end sudah terisi
		if (v?.start && v?.end) {
			// Update state dengan tanggal baru
			state.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			state.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

			console.log('Fetching data for:', state.startDate, state.endDate);

			// Fetch ulang data
			handleGetSummary(state.startDate, state.endDate);
			handleGetChart(state.startDate, state.endDate, state.filter);

			// Tutup Popover otomatis setelah end date dipilih
			popoverOpen = false;
		}
	}

	// ✅ Helper untuk tampilkan teks tanggal dengan aman
	function formatDateText() {
		if (!state.startDate || !state.endDate) return 'Pick a date';
		return (
			df.format(dayjs(state.startDate).toDate()) + ' - ' + df.format(dayjs(state.endDate).toDate())
		);
	}

	let showModalAwal = false;

	onMount(() => {
		modalService.getStatusModalAwal()
			.then((res: any) => {
				if (res.data?.data == null) {
					showModalAwal = true;
				}
				console.log(res.data,'ofofo')
			});
	});
</script>

<svelte:head>
	<title>Dashboard | Bantuit</title>
</svelte:head>

<div class="container flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-4">
		<!-- 🔹 Kalender -->
		<div class="grid max-w-65 gap-2">
			<Popover.Root bind:open={popoverOpen}>
				<Popover.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'flex items-center')}>
					<CalendarIcon class="mr-2 size-4" />
					{formatDateText()}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<RangeCalendar
						numberOfMonths={2}
						onValueChange={handleDateChange}
						value={{
							start: new CalendarDate(
								Number(dayjs(state.startDate).format('YYYY')),
								Number(dayjs(state.startDate).format('M')),
								Number(dayjs(state.startDate).format('D'))
							),
							end: new CalendarDate(
								Number(dayjs(state.endDate).format('YYYY')),
								Number(dayjs(state.endDate).format('M')),
								Number(dayjs(state.endDate).format('D'))
							)
						}}
					/>
				</Popover.Content>
			</Popover.Root>
		</div>

		<!-- 🔹 Konten utama -->
		<div class="flex flex-col gap-4 md:gap-6">
			<HighlightCard {state} />
			<ChartVisitors {state} />
			{#if showModalAwal}
				<FormModalAwal type="create" {showModalAwal} />
			{/if}
		</div>
	</div>
</div>