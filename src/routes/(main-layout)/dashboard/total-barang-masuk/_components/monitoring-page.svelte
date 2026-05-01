<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { useMonitoringPage } from './use-monitoring.svelte';
	import { cn } from '$lib/utils.js';

	const { state, handlePageChange, toggleRow } = useMonitoringPage();

	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		} else {
			state.searchTerm = '';
		}
	}
</script>

<!-- HEADER -->
<header class="mb-4 sm:mb-6 md:mb-8">
	<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center">
			<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
				Total Barang Masuk
			</h1>
		</div>

		<div class="flex gap-2">
			<!-- Search Container -->
			<div class="relative flex w-full items-center justify-end sm:w-auto">
				<div class="overflow-hidden">
					{#if state.showSearch}
						<input
							bind:this={state.searchEl}
							bind:value={state.searchTerm}
							transition:fly={{ x: 120, duration: 250 }}
							placeholder="Search transaction or item..."
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
		</div>
	</div>
</header>

<!-- LOADING STATE -->
{#if state.isLoading}
	<div class="flex items-center justify-center py-12">
		<div class="flex flex-col items-center gap-3">
			<Icon icon="eos-icons:loading" width="40" height="40" class="text-primary" />
			<p class="text-sm text-gray-500">Loading data...</p>
		</div>
	</div>
{:else}
	<!-- TABLE -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<div class="inline-block min-w-full align-middle">
			<div class="overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-100">
						<tr>
							<th
								class="w-8 px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3"
							></th>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>No</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Transaction Number</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Item ID</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Name</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Description</th
							>
							<th
								class="px-3 py-2.5 text-center text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>QTY</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Remarks</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Location</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>From</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>To</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Scan By</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Date</th
							>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-200 bg-white">
						{#if state.table.length === 0}
							<tr>
								<td colspan="13" class="px-4 py-8 text-center text-sm text-gray-500">
									No records found
								</td>
							</tr>
						{:else}
							{#each state.table as row}
								<tr class="transition hover:bg-gray-50">
									<!-- Expand button -->
									<td class="px-3 py-2.5 sm:px-4 sm:py-3">
										<button
											type="button"
											onclick={() => toggleRow(row.rowKey, row.item_id)}
											class="rounded p-1 transition hover:bg-gray-200"
										>
											<Icon
												icon={row.open ? 'mdi:chevron-down' : 'mdi:chevron-right'}
												width="20"
												height="20"
												class="text-gray-600"
											/>
										</button>
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-500 sm:px-4 sm:py-3 md:text-sm">
										{row.no}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.transaction_number}
									</td>
									<td
										class="px-3 py-2.5 text-xs font-medium text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.item_id}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.nama_barang}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.deskripsi}
									</td>
									<td
										class="px-3 py-2.5 text-center text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.qty}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.remarks}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.location}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.from}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.to}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.scan_by}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm whitespace-nowrap">
										{row.created_date}
									</td>
								</tr>

								<!-- Details Row (Expandable) -->
								{#if row.open === true}
									<tr class="bg-white">
										<td colspan="13" class="px-3 py-2 sm:px-4">
											<div class="overflow-hidden rounded border border-gray-200">
												<table class="min-w-full text-sm">
													<thead class="bg-gray-200 font-bold text-gray-700">
														<tr>
															<th class="px-3 py-2 text-left text-xs font-bold">Barcode ID</th>
															<th class="px-3 py-2 text-left text-xs font-bold">Pemasukan</th>
															<th class="px-3 py-2 text-left text-xs font-bold">Created Date</th>
														</tr>
													</thead>
													<tbody class="bg-white">
														{#if row.isLoadingDetails}
															<tr>
																<td colspan="3" class="px-3 py-4 text-center">
																	<div class="flex items-center justify-center gap-2">
																		<Icon icon="eos-icons:loading" class="text-primary h-4 w-4" />
																		<span class="text-xs text-gray-500">Loading details...</span>
																	</div>
																</td>
															</tr>
														{:else if row.details.length === 0}
															<tr>
																<td colspan="3" class="px-3 py-4 text-center text-xs text-gray-500">
																	No detailed data found.
																</td>
															</tr>
														{:else}
															{#each row.details as detail}
																<tr class="border-t border-gray-100">
																	<td class="px-3 py-2 text-xs text-gray-900">{detail.barcode_id}</td>
																	<td class="px-3 py-2 text-xs text-gray-900">{detail.pemasukan}</td>
																	<td class="px-3 py-2 text-xs text-gray-900">{detail.created_date}</td>
																</tr>
															{/each}
														{/if}
													</tbody>
												</table>
											</div>
										</td>
									</tr>
								{/if}
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
{/if}
