<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { useInventoryReportPage } from '../../use-page.svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import dayjs from 'dayjs';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import { inventoryReportService } from '@/services/inventoryReportService';

	const { state, handlePageChange } = useInventoryReportPage();
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	let popoverOpen = false;

	// ✅ Ubah tanggal → update di state & fetch ulang data
	function handleDateChange(v: any) {
		// Cek apakah start dan end sudah terisi
		if (v?.start && v?.end) {
			state.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			state.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

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

	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		}
	}

	function downloadExcel() {
		inventoryReportService.getReportExcel({
			PageNumber: 1,
			PageSize: state.pageSize,
			SearchTerm: state.searchTerm,
			EndDate: state.endDate,
			StartDate: state.startDate
		});
	}
</script>

<div class="w-full">
	<div class="max-w-8xl mx-auto">
		<!-- HEADER -->
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center justify-between">
					<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
						Laporan Inventory
					</h1>
				</div>
				<!-- Search Container -->
				<div class="flex gap-2">
					<div class="relative flex w-full items-center justify-end sm:w-auto">
						<div class="overflow-hidden">
							{#if state.showSearch}
								<input
									bind:value={state.searchTerm}
									transition:fly={{ x: 120, duration: 250 }}
									placeholder="Search item..."
									class="bg-primary/10 w-full rounded-full border-none px-3 py-2 pr-10 text-sm shadow-sm transition outline-none sm:w-48 md:w-56"
								/>
							{/if}
						</div>
						<button
							type="button"
							class="absolute right-0 rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
							onclick={toggleSearch}
						>
							<Icon
								icon="majesticons:search-line"
								width="20"
								height="20"
								class="text-gray-600 md:h-[22px] md:w-[22px]"
							/>
						</button>
					</div>
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
					<div>
						<Button onclick={downloadExcel}>Export</Button>
					</div>
				</div>
			</div>
		</header>

		<!-- TABLE - Horizontal Scroll Container -->
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
			<div class="inline-block min-w-full align-middle">
				<div class="overflow-hidden">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-100">
							<tr>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									No
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Item
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Type
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Stock Awal
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pemasukan
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pengeluaran Delivery
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pengeluaran Jahit
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pengeluaran NG
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pengeluaran Sample
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Pemasukan Return
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Stock Akhir
								</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-gray-200 bg-white">
							{#if state.table.length === 0}
								<tr>
									<td colspan="11" class="px-4 py-8 text-center text-sm text-gray-500">
										No inventory data found
									</td>
								</tr>
							{:else}
								{#each state.table as row, index}
									<tr class="transition hover:bg-gray-50">
										<td
											class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
										>
											{(state.currentPage - 1) * state.pageSize + index + 1}
										</td>
										<td
											class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.name}
										</td>
										<td
											class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											<span
												class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
											>
												{row.type}
											</span>
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.stockAwal}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.pemasukan}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.pengeluaranDelivery}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.pengeluaranJahit}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											<span class={row.pengeluaranNG > 0 ? 'text-red-600' : ''}>
												{row.pengeluaranNG}
											</span>
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.pengeluaranSample}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.pemasukanReturn}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.stockAkhir}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- PAGINATION -->
		<div class="w-full">
			<Pagination.Root count={state.totalCount} perPage={state.pageSize} page={state.currentPage}>
				{#snippet children({ pages, currentPage })}
					<div class="mt-4 flex w-full items-center justify-between">
						<p class="text-sm text-gray-600">
							Showing <strong>{(state.currentPage - 1) * state.pageSize + 1}</strong> to
							<strong>{Math.min(state.currentPage * state.pageSize, state.totalCount)}</strong> of
							<strong>{state.totalCount}</strong> results
						</p>

						<Pagination.Content>
							<Pagination.Item class="hidden md:block">
								<Pagination.PrevButton onclick={() => handlePageChange(state.currentPage - 1)} />
							</Pagination.Item>

							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
									<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
								{:else}
									<Pagination.Item>
										<Pagination.Link
											{page}
											isActive={currentPage === page.value}
											onclick={() => handlePageChange(page.value)}
										>
											{page.value}
										</Pagination.Link>
									</Pagination.Item>
								{/if}
							{/each}

							<Pagination.Item class="hidden md:block">
								<Pagination.NextButton onclick={() => handlePageChange(state.currentPage + 1)} />
							</Pagination.Item>
						</Pagination.Content>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
</div>
