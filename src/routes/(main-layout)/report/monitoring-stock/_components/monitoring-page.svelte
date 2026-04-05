<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { useMonitoringPage } from './use-monitoring.svelte';
	import { cn } from '$lib/utils.js';

	const { state, handlePageChange, handleSearch, toggleRow } = useMonitoringPage();

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;
	let searchTerm = '';

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		} else {
			searchTerm = '';
			handleSearch('');
		}
	}

	function onSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchTerm = target.value;
		handleSearch(searchTerm);
	}
</script>

<!-- HEADER -->
<header class="mb-4 sm:mb-6 md:mb-8">
	<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center">
			<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
				Monitoring Stock
			</h1>
		</div>

		<div class="flex gap-2">
			<!-- Search Container -->
			<div class="relative flex w-full items-center justify-end sm:w-auto">
				<div class="overflow-hidden">
					{#if showSearch}
						<input
							bind:this={searchEl}
							bind:value={searchTerm}
							oninput={onSearchInput}
							transition:fly={{ x: 120, duration: 250 }}
							placeholder="Search item or supplier..."
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
			<p class="text-sm text-gray-500">Loading stock data...</p>
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
							<th class="w-8 px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3"
							></th>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>No</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Inv Number</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Supplier</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Item ID</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Item Name</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Description</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Qty</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Sisa</th
							>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-200 bg-white">
						{#if state.table.length === 0}
							<tr>
								<td colspan="9" class="px-4 py-8 text-center text-sm text-gray-500">
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
									<td class="px-3 py-2.5 text-xs font-medium text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.inv_number}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.supplier}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.item_id}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.nama_barang}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.deskripsi}
									</td>
									<td class="px-3 py-2.5 text-right text-xs font-semibold text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.qty}
									</td>
									<td class="px-3 py-2.5 text-right text-xs font-semibold text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										<span class={cn('rounded px-1.5 py-0.5', row.sisa > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700')}>
											{row.sisa}
										</span>
									</td>
								</tr>

								<!-- Details Row (Expandable) -->
								{#if row.open === true}
									<tr class="bg-gray-50">
										<td colspan="9" class="px-3 py-4 sm:px-4">
											<div class="space-y-3">
												<div class="flex items-center justify-between">
													<h4 class="text-sm font-semibold text-gray-700">Stock Details for {row.nama_barang}</h4>
												</div>

												{#if row.isLoadingDetails}
													<div class="flex items-center gap-2 py-4 text-xs text-gray-500">
														<Icon icon="eos-icons:loading" width="16" height="16" class="text-primary" />
														<span>Loading details...</span>
													</div>
												{:else if row.details.length === 0}
													<div class="py-4 text-xs text-gray-500">No detailed data found.</div>
												{:else}
													<div class="overflow-x-auto rounded border border-gray-200">
														<table class="min-w-full text-sm">
															<thead class="bg-gray-100">
																<tr>
																	<th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Item Code</th>
																	<th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Item Name</th>
																	<th class="px-3 py-2 text-left text-xs font-medium text-gray-600">Description</th>
																	<th class="px-3 py-2 text-right text-xs font-medium text-gray-600">Stock</th>
																	<th class="px-3 py-2 text-right text-xs font-medium text-gray-600">Kebutuhan</th>
																	<th class="px-3 py-2 text-right text-xs font-medium text-gray-600">Selisih</th>
																</tr>
															</thead>
															<tbody class="divide-y divide-gray-200 bg-white">
																{#each row.details as detail}
																	<tr>
																		<td class="px-3 py-2 text-gray-900">{detail.kode_barang}</td>
																		<td class="px-3 py-2 text-gray-900">{detail.nama_barang}</td>
																		<td class="px-3 py-2 text-gray-900">{detail.deskripsi}</td>
																		<td class="px-3 py-2 text-right text-gray-900 font-medium">{detail.stock}</td>
																		<td class="px-3 py-2 text-right text-gray-900 font-medium">{detail.kebutuhan}</td>
																		<td class="px-3 py-2 text-right font-bold {detail.selisih < 0 ? 'text-red-600' : 'text-green-600'}">
																			{detail.selisih}
																		</td>
																	</tr>
																{/each}
															</tbody>
														</table>
													</div>
												{/if}
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
