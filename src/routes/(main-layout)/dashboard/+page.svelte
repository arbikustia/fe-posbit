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
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { FormModalAwal } from './_components/form-modal-awal';
	import { HighlightGudang } from './_components/highlight-gudang';
	import { useDashboardInventory } from './_components/highlight-gudang/use-highlight-gudang.svelte';

	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	// ✅ Ambil semua state & handler langsung dari useDashboardPage
	const { state: pageState, handleGetSummary, handleGetChart } = useDashboardPage();
		const {handleDateFilter} = useDashboardInventory()

	let popoverOpen = false;

	// ✅ Ubah tanggal → update di state & fetch ulang data
	function handleDateChange(v: any) {
		console.log('Date changed:', v);

		// Cek apakah start dan end sudah terisi
		if (v?.start && v?.end) {
			// Update state dengan tanggal baru
			pageState.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			pageState.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

			console.log('Fetching data for:', pageState.startDate, pageState.endDate);

			// Fetch ulang data
			handleGetSummary(pageState.startDate, pageState.endDate);
			handleGetChart(pageState.startDate, pageState.endDate, pageState.filter);

			// Tutup Popover otomatis setelah end date dipilih
			popoverOpen = false;
		}
	}

	// ✅ Helper untuk tampilkan teks tanggal dengan aman
	function formatDateText() {
		if (!pageState.startDate || !pageState.endDate) return 'Pick a date';
		return (
			df.format(dayjs(pageState.startDate).toDate()) +
			' - ' +
			df.format(dayjs(pageState.endDate).toDate())
		);
	}
</script>

<svelte:head>
	<title>Dashboard | Bantuit</title>
</svelte:head>

<Tabs.Root value="toko" class="container">
	<Tabs.List>
		<Tabs.Trigger value="toko">Toko</Tabs.Trigger>
		<Tabs.Trigger value="gudang">Gudang</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="toko">
		<div class="w-full flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-4">
				<!-- 🔹 Kalender -->
				<div class="grid max-w-65 gap-2">
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger
							class={cn(buttonVariants({ variant: 'outline' }), 'flex items-center')}
						>
							<CalendarIcon class="mr-2 size-4" />
							{formatDateText()}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								numberOfMonths={2}
								onValueChange={handleDateChange}
								value={{
									start: new CalendarDate(
										Number(dayjs(pageState.startDate).format('YYYY')),
										Number(dayjs(pageState.startDate).format('M')),
										Number(dayjs(pageState.startDate).format('D'))
									),
									end: new CalendarDate(
										Number(dayjs(pageState.endDate).format('YYYY')),
										Number(dayjs(pageState.endDate).format('M')),
										Number(dayjs(pageState.endDate).format('D'))
									)
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<!-- 🔹 Konten utama -->
				<div class="flex flex-col gap-4 md:gap-6">
					<HighlightCard state={pageState} />
					<ChartVisitors state={pageState} />
				</div>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="gudang">
		<div class="w-full flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-4">
				<!-- 🔹 Kalender -->
				<div class="grid max-w-65 gap-2">
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger
							class={cn(buttonVariants({ variant: 'outline' }), 'flex items-center')}
						>
							<CalendarIcon class="mr-2 size-4" />
							{formatDateText()}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								numberOfMonths={2}
								onValueChange={handleDateChange}
								value={{
									start: new CalendarDate(
										Number(dayjs(pageState.startDate).format('YYYY')),
										Number(dayjs(pageState.startDate).format('M')),
										Number(dayjs(pageState.startDate).format('D'))
									),
									end: new CalendarDate(
										Number(dayjs(pageState.endDate).format('YYYY')),
										Number(dayjs(pageState.endDate).format('M')),
										Number(dayjs(pageState.endDate).format('D'))
									)
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<!-- 🔹 Konten utama -->
				<div class="flex flex-col gap-4 md:gap-6">
					<HighlightGudang state={pageState} />
				</div>
			</div>
		</div>
	</Tabs.Content>
</Tabs.Root>
