<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { usePurchaseReportPage } from '../../create/use-create.svelte';

	const { state, handlePageChange, handleGetPaged } = usePurchaseReportPage();

	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		}
	}
</script>

<div class="w-full">
	<div class="mx-auto max-w-7xl">
		<!-- HEADER -->
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
					Purchase Report
				</h1>
			</div>

			<div class="mt-3 flex flex-row justify-end gap-3 sm:mt-4 md:mt-6">
				<!-- Search Container -->
				<div class="relative flex w-full items-center justify-end sm:w-auto">
					<div class="overflow-hidden">
						{#if state.showSearch}
							<input
								bind:value={state.searchTerm}
								bind:this={state.searchEl}
								transition:fly={{ x: 120, duration: 250 }}
								placeholder="Search purchase..."
								class="bg-primary/10 w-full rounded-full border-none px-3 py-2 pr-10 text-sm shadow-sm transition outline-none sm:w-48 md:w-56"
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										handleGetPaged(1, state.searchTerm);
									}
								}}
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
									Invoice Number
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Supplier
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Item
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Qty In
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Qty Out
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Status
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Total Amount
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Date
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#if state.isLoading}
								<tr>
									<td colspan="9" class="px-3 py-8 text-center text-sm text-gray-500">
										<div class="flex items-center justify-center gap-2">
											<Icon icon="line-md:loading-loop" width="20" height="20" />
											<span>Loading...</span>
										</div>
									</td>
								</tr>
							{:else if state.table.length === 0}
								<tr>
									<td colspan="9" class="px-3 py-8 text-center text-sm text-gray-500">
										No data available
									</td>
								</tr>
							{:else}
								{#each state.table as row, index}
									<tr class="transition hover:bg-gray-50">
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-500 sm:px-4 sm:py-3 md:text-sm"
										>
											{(state.currentPage - 1) * state.pageSize + index + 1}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.inv_number}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.person_name}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.item_name}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.qty}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.qty_keluar}
										</td>
										<td class="whitespace-nowrap px-3 py-2.5 sm:px-4 sm:py-3 md:text-sm">
											<span
												class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium md:py-1 md:text-sm {row.status ===
												'COMPLETED'
													? 'bg-green-500/10 text-green-700'
													: row.status === 'PENDING'
														? 'bg-yellow-500/10 text-yellow-700'
														: 'bg-gray-500/10 text-gray-700'}"
											>
												{row.status || '-'}
											</span>
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{new Intl.NumberFormat('id-ID', {
												style: 'currency',
												currency: 'IDR'
											}).format(row.total_amount)}
										</td>
										<td
											class="whitespace-nowrap px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
										>
											{row.created_at}
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
			<Pagination.Root count={state.totalCount} perPage={state.pageSize}>
				{#snippet children({ pages, currentPage })}
					<div class="mt-4 flex w-full justify-end">
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