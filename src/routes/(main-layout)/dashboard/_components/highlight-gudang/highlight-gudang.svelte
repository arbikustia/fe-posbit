<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { goto } from '$app/navigation';
	import { useDashboardInventory } from './use-highlight-gudang.svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import dayjs from 'dayjs';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	const { state } = $props();
	// let popoverOpenGudang = false;
	function formatGudangDateText() {
		if (!state.startDate || !state.endDate) return 'Pick a date';
		return (
			df.format(dayjs(state.startDate).toDate()) + ' - ' + df.format(dayjs(state.endDate).toDate())
		);
	}

	function handleDateChangeGudang(v: any) {
		console.log('Date changed:', v);

		// Cek apakah start dan end sudah terisi
		if (v?.start && v?.end) {
			// Update state dengan tanggal baru
			state.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			state.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

			console.log('Fetching data for:', state.startDate, state.endDate);

			// Fetch ulang data
			// handleDateFilter(state.startDate, state.endDate);

			// Tutup Popover otomatis setelah end date dipilih
			state.popoverOpenGudang = false;
		}
	}
</script>

<div class="space-y-3">
	<div class="w-full">
		<Popover.Root bind:open={state.popoverOpenGudang}>
			<Popover.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'flex items-center')}>
				<CalendarIcon class="mr-2 size-4" />
				{formatGudangDateText()}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<RangeCalendar
					numberOfMonths={2}
					onValueChange={handleDateChangeGudang}
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
	<div class="highlight-card">
		<!-- Total Penjualan Bulan Ini -->
		<Card.Root
			onclick={() => goto(`/dashboard/stock-gudang?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 px-4 pt-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:warehouse" class="text-2xl text-emerald-500 md:text-2xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Total Stock Gudang
					</Card.Description>
				</div>
				<div class="flex justify-between w-full gap-4 h-12">
					<Card.Title class="text-2xl shadow-sm text-center rounded-md h-full flex items-center justify-center bg-green-500/10  w-full font-semibold tabular-nums md:text-2xl lg:text-2xl">
						{state.list.stock_all_gudang ?? 0}
					</Card.Title>
					<Card.Title class="text-2xl shadow-sm text-center rounded-md h-full flex items-center justify-center bg-green-500/10  w-full font-semibold tabular-nums md:text-2xl lg:text-2xl">
						{state.list.stock_all_gudang ?? 0}
					</Card.Title>
				</div>
			</Card.Header>
		</Card.Root>

		<!-- Jumlah Transaksi -->
		<Card.Root
			onclick={() =>
				goto(`/dashboard/total-barang-masuk?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:package-down" class="text-2xl text-blue-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Total Barang Masuk
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.stock_in_gudang ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<!-- Jumlah Pelanggan Baru -->
		<Card.Root
			onclick={() =>
				goto(`/dashboard/total-barang-keluar?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:package-up" class="text-2xl text-amber-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Total Barang Keluar
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.stock_out_gudang ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root
			onclick={() => goto(`/dashboard/out-toko?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:store-off-outline" class="text-2xl text-blue-800 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Out Toko
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.out_toko ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root
			onclick={() =>
				goto(`/dashboard/stock-jahit-label?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:needle" class="text-2xl text-amber-800 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Stock Jahit label
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.stock_jahit_label ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root
			onclick={() =>
				goto(`/dashboard/stock-delivery?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:truck-delivery" class="text-2xl text-pink-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Stock Delivery
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.stock_delivery ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root
			onclick={() => goto(`/dashboard/out-customer?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon
						icon="mdi:account-arrow-right-outline"
						class="text-2xl text-purple-500 md:text-3xl"
					/>
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Out Customer
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.out_customer ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root
			onclick={() => goto(`/dashboard/barang-ng?Start=${state.startDate}&End=${state.endDate}`)}
			class="@container/card h-fit min-h-28 cursor-pointer p-0"
		>
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon
						icon="streamline-flex:incorrect-password-remix"
						class="text-2xl text-red-500 md:text-3xl"
					/>
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Barang NG
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state.list.total_ng ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<!-- <Card.Root onclick={() => goto('/dashboard/stock-sample')} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="streamline-flex:incorrect-password-remix" class="text-2xl text-red-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Stock Sample
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_sample ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root> -->
	</div>
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3;
	}
</style>
