<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { useMasterItemPage } from '../../use-page.svelte';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		}
	}

	// ✅ Ambil data langsung dari state.table
	const { state, handlePageChange } = useMasterItemPage();
</script>

<div class="mx-auto w-full max-w-7xl">
	<!-- HEADER -->
	<header class="mb-4 sm:mb-6 md:mb-8">
		<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
			<Button
				variant="ghost"
				class="flex w-28 cursor-default items-center justify-center gap-2 rounded-full bg-transparent px-0 py-2 text-xs hover:bg-transparent sm:w-auto md:w-fit md:text-sm"
			>
				<div class="flex items-center justify-between">
					<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
						Master Item
					</h1>
				</div>
			</Button>

			<!-- Search Container -->
			<div class="relative flex w-full items-center justify-end sm:w-auto">
				<div class="overflow-hidden">
					{#if showSearch}
						<input
							bind:this={searchEl}
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
		</div>
	</header>

	<!-- TABLE -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-100">
				<tr class="text-left text-sm font-medium text-gray-700">
					<th
						class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
						>No</th
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
						class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
						>Harga Beli</th
					>
					<th
						class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
						>Harga Jual</th
					>
					<th
						class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
						>Qty</th
					>
				</tr>
			</thead>

			<tbody class="divide-y divide-gray-200 bg-white">
				{#each state.table as row, index}
					<tr class="transition hover:bg-gray-50">
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
							>{index + 1}</td
						>
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
							>{row.nama_barang}</td
						>
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
							>{row.deskripsi}</td
						>
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
							>Rp {row.harga_beli?.toLocaleString?.() ?? '-'}</td
						>
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
							>Rp {row.harga_jual?.toLocaleString?.() ?? '-'}</td
						>
						<td
							class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
							>{row.qty}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- PAGINATION -->
	<!-- <div class="w-full">
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
	</div> -->
</div>
