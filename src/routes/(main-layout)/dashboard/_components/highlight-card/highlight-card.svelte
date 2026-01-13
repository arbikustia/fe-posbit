<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import dayjs from 'dayjs';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });
	// Props diterima dari parent (Dashboard)
	const { state, handleGetSummary, handleGetChart } = $props();
	function formatDateText() {
		if (!state.startDate || !state.endDate) return 'Pick a date';
		return (
			df.format(dayjs(state.startDate).toDate()) + ' - ' + df.format(dayjs(state.endDate).toDate())
		);
	}

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
			state.popoverOpen = false;
		}
	}
</script>

<div class='space-y-4'>
	<div>
		<Popover.Root bind:open={state.popoverOpen}>
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
	<div class="highlight-card">
		<!-- Total Penjualan Bulan Ini -->
		<Card.Root class="@container/card h-fit min-h-28 p-0">
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:cash-multiple" class="text-2xl text-emerald-500 md:text-2xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Total Penjualan Bulan Ini
					</Card.Description>
				</div>
				<Card.Title class="text-2xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					Rp {state?.summary?.total_sale?.toLocaleString('id-ID') ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<!-- Jumlah Transaksi -->
		<Card.Root class="@container/card h-fit min-h-28 p-0">
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:cart-outline" class="text-2xl text-blue-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Jumlah Transaksi
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state?.summary?.total_tTransaction ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<!-- Jumlah Pelanggan Baru -->
		<Card.Root class="@container/card h-fit min-h-28 p-0">
			<Card.Header class="flex flex-col items-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-start">
					<Icon icon="mdi:account-plus-outline" class="text-2xl text-amber-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Jumlah Pelanggan Baru
					</Card.Description>
				</div>
				<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
					{state?.summary?.new_customer ?? 0}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<!-- Penjualan Item Terbanyak -->
		<Card.Root class="@container/card col-span-full p-0">
			<Card.Header class="flex flex-col items-center justify-center space-y-2 p-4">
				<div class="flex w-full items-center justify-center gap-2 md:justify-center">
					<Icon icon="iconoir:bright-star" class="text-2xl text-yellow-500 md:text-3xl" />
					<Card.Description class="text-center text-lg md:text-left md:text-sm">
						Penjualan Item Terbanyak
					</Card.Description>
				</div>

				{#if state?.summary?.top_five?.length > 0}
					<div class="grid w-full grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-5">
						{#each state.summary.top_five.slice(0, 5) as item, index}
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div class="flex flex-col rounded-lg border p-3 pb-2 shadow">
											<div
												class="truncate text-center text-base font-semibold md:text-left md:text-base"
											>
												{index + 1}. {item?.name ?? 'Unknown Item'}
											</div>
											<div class="mt-1 flex flex-wrap justify-center gap-2 md:justify-start">
												<span
													class="bg-primary/10 border-primary flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium md:text-xs"
													>Qty {item?.qty ?? 0}</span
												>
												<!-- <span
									class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-xs font-medium"
									>Rp {(item?.total ?? 0).toLocaleString('id-ID')}</span
								> -->
											</div>
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>{item?.name}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						{/each}
					</div>
				{:else}
					<p class="text-muted-foreground mt-2 text-center text-sm">
						Tidak ada data penjualan item.
					</p>
				{/if}
			</Card.Header>
		</Card.Root>
	</div>
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3;
	}
</style>
