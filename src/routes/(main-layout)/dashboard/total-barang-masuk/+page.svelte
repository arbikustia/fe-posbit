<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import dayjs from 'dayjs';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { useSummaryShiftPage } from './use-total-barang-masuk.svelte';

	const { state, handlePageChange, handleGetPaged } = useSummaryShiftPage();
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	let popoverOpen = false;

	function handleDateChange(v: any) {
		console.log('Date changed:', v);

		if (v?.start && v?.end) {
			state.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			state.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

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
</script>

<div class="container w-full">
	<div class="max-w-8xl mx-auto">
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center justify-between">
					<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
						Total Stock Gudang
					</h1>
				</div>
				<div class="flex gap-2">
					<div class="relative flex w-full items-center justify-end sm:w-auto">
						<div class="overflow-hidden">
							{#if state.showSearch}
								<input
									bind:value={state.searchTerm}
									transition:fly={{ x: 120, duration: 250 }}
									placeholder="Search Stock Gudang..."
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
									numberOfMonths={3}
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
									Transaction Number
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Item ID
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									QTY
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Location
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									From
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									To
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Scan By
								</th>
								<th
									class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Date
								</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-gray-200 bg-white">
							{#if state.table.length === 0}
								<tr>
									<td colspan="10" class="px-4 py-8 text-center text-sm text-gray-500">
										No Stock found
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
											{row.transaction_number}
										</td>
										<td
											class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.item_id}
										</td>
										<td
											class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.qty}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.location}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.from}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.to}
										</td>
										<td
											class="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.scan_by}
										</td>
										<td
											class="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.transaction_date}
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
						<Select.Root
							type="single"
							value={String(state.pageSize)}
							onValueChange={(v) => {
								state.pageSize = Number(v);
								handleGetPaged(state.currentPage);
							}}
						>
							<Select.Trigger class="mt-4 w-[80px]">{state.pageSize}</Select.Trigger>
							<Select.Content>
								<Select.Item value="5">5</Select.Item>
								<Select.Item value="10">10</Select.Item>
								<Select.Item value="20">20</Select.Item>
								<Select.Item value="30">30</Select.Item>
								<Select.Item value="40">40</Select.Item>
								<Select.Item value="50">50</Select.Item>
								<Select.Item value="70">70</Select.Item>
								<Select.Item value="100">100</Select.Item>
							</Select.Content>
						</Select.Root>
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
