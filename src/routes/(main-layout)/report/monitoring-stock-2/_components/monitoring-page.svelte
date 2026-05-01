<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { useMonitoringPage } from './use-monitoring.svelte';
	import { cn } from '$lib/utils.js';

	const { state, handlePageChange } = useMonitoringPage();

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
				Monitoring Stock 2
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
								>Nama Barang</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Qty</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Sisa</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Description</th
							>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-200 bg-white">
						{#if state.table.length === 0}
							<tr>
								<td colspan="8" class="px-4 py-8 text-center text-sm text-gray-500">
									No records found
								</td>
							</tr>
						{:else}
							{#each state.table as row}
								<tr class="transition hover:bg-gray-50">
									<td class="px-3 py-2.5 text-xs text-gray-500 sm:px-4 sm:py-3 md:text-sm">
										{row.no}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.inv_number}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.supplier}
									</td>
									<td
										class="px-3 py-2.5 text-xs font-medium text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.item_id}
									</td>
									<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.nama_barang}
									</td>
									<td class="px-3 py-2.5 text-right text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">
										{row.qty}
									</td>
									<td
										class="px-3 py-2.5 text-right text-xs font-bold text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.sisa}
									</td>
									<td
										class="px-3 py-2.5 text-left text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.deskripsi}
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
{/if}
