<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		}
	}

	type ItemRow = {
		id: number;
		item_name: string;
		qty_stok_toko: number;
		harga_beli: number;
		harga_jual: number;
		qty: number;
		open?: boolean;
	};

	let rows: ItemRow[] = [
		{
			id: 1,
			item_name: 'Kopi Kapal Api',
			qty_stok_toko: 120,
			harga_beli: 2500,
			harga_jual: 3500,
			qty: 3,
			open: true
		},
		{
			id: 2,
			item_name: 'Indomie Goreng',
			qty_stok_toko: 85,
			harga_beli: 2800,
			harga_jual: 4000,
			qty: 5,
			open: true
		},
		{
			id: 3,
			item_name: 'Aqua Botol 600ml',
			qty_stok_toko: 50,
			harga_beli: 3500,
			harga_jual: 5000,
			qty: 2,
			open: true
		}
	];
</script>

<div class="mx-auto w-full max-w-7xl">
	<!-- HEADER -->
	<header class="mb-4 sm:mb-6 md:mb-8">
		<div class=" flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
			<!-- New Customer Button -->
			<Button
				variant="ghost"
				class="flex w-28 cursor-default items-center justify-center gap-2 rounded-full bg-transparent px-0 py-2  text-xs hover:bg-transparent sm:w-auto  md:w-fit md:text-sm"
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
							placeholder="Search customer..."
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
					<th class="px-4 py-3">No</th>
					<th class="px-4 py-3">Item Name</th>
					<th class="px-4 py-3">Qty Stok Toko</th>
					<th class="px-4 py-3">Harga Beli</th>
					<th class="px-4 py-3">Harga Jual</th>
					<th class="px-4 py-3">Qty</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each rows as row, index}
					<tr class="transition hover:bg-gray-50">
						<td class="px-4 py-3 text-gray-500">{index + 1}</td>
						<td class="px-4 py-3 font-medium">{row.item_name}</td>
						<td class="px-4 py-3">{row.qty_stok_toko}</td>
						<td class="px-4 py-3">Rp {row.harga_beli.toLocaleString()}</td>
						<td class="px-4 py-3">Rp {row.harga_jual.toLocaleString()}</td>
						<td class="px-4 py-3">{row.qty}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<!-- PAGINATION -->
	<div class="w-full">
		<Pagination.Root count={100} perPage={10}>
			{#snippet children({ pages, currentPage })}
				<div class="mt-4 flex w-full justify-end">
					<Pagination.Content>
						<Pagination.Item class="hidden md:block"><Pagination.PrevButton /></Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item class="hidden md:block"><Pagination.NextButton /></Pagination.Item>
					</Pagination.Content>
				</div>
			{/snippet}
		</Pagination.Root>
	</div>
</div>
