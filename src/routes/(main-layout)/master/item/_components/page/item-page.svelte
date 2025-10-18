<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		}
	}

	// 🔹 Struktur data sesuai gambar
	type ItemRow = {
		id: number;
		item_name: string;
		qty_stok_toko: number;
		harga_beli: number;
		harga_jual: number;
		qty: number;
		open?: boolean;
	};

	// 🔹 Data dummy
	const rows: ItemRow[] = [
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

	// 🔥 State untuk modal delete
	let showDeleteModal = false;
	let selectedItem: ItemRow | null = null;

	function openDeleteModal(item: ItemRow) {
		selectedItem = item;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedItem = null;
	}

	function confirmDelete() {
		if (selectedItem) {
			console.log('Deleting item:', selectedItem.item_name);
			const index = rows.findIndex((r) => r.id === selectedItem?.id);
			if (index !== -1) rows.splice(index, 1);
			closeDeleteModal();
		}
	}
</script>

<!-- HEADER -->
<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Master Item</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<div class="h-9"></div>
		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search item..."
						class="bg-primary/10 w-56 rounded-full border-none px-3 py-2 text-sm shadow-sm transition outline-none"
					/>
				{/if}
			</div>

			<button
				type="button"
				class="absolute right-0 rounded-full p-2 transition dark:hover:bg-gray-800"
				on:click={toggleSearch}
			>
				<Icon icon="majesticons:search-line" width="22" height="22" class="text-gray-600" />
			</button>
		</div>
	</div>
</header>

<!-- TABLE -->
<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full">
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
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="w-16 px-4 py-3 text-gray-500">{index + 1}</td>
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
<Pagination.Root count={100} perPage={10}>
	{#snippet children({ pages, currentPage })}
		<div class="mt-4 flex w-full justify-end">
			<Pagination.Content>
				<Pagination.Item><Pagination.PrevButton /></Pagination.Item>
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
				<Pagination.Item><Pagination.NextButton /></Pagination.Item>
			</Pagination.Content>
		</div>
	{/snippet}
</Pagination.Root>
