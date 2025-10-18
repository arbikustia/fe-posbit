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

	type TableRow = {
		id: number;
		inv_number: string;
		item_id: string;
		cust_id: string;
		point_used: number;
		point_earned: number;
		status: string;
		total_amount: number;
		final_amount: number;
		discount_amount: number;
		payment_method: string;
		open?: boolean;
	};

	const rows: TableRow[] = [
		{
			id: 1,
			inv_number: 'INV-001',
			item_id: 'ITM-1001',
			cust_id: 'CST-2001',
			point_used: 10,
			point_earned: 20,
			status: 'Completed',
			total_amount: 500000,
			final_amount: 450000,
			discount_amount: 50000,
			payment_method: 'Cash',
			open: true
		},
		{
			id: 2,
			inv_number: 'INV-002',
			item_id: 'ITM-1002',
			cust_id: 'CST-2002',
			point_used: 5,
			point_earned: 10,
			status: 'Pending',
			total_amount: 300000,
			final_amount: 300000,
			discount_amount: 0,
			payment_method: 'QRIS',
			open: true
		}
	];

	// 🔥 Modal delete
	let showDeleteModal = false;
	let selectedRow: TableRow | null = null;

	function openDeleteModal(row: TableRow) {
		selectedRow = row;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedRow = null;
	}

	function confirmDelete() {
		if (selectedRow) {
			console.log('Deleting invoice:', selectedRow.inv_number);
			const index = rows.findIndex((r) => r.id === selectedRow?.id);
			if (index !== -1) rows.splice(index, 1);
			closeDeleteModal();
		}
	}
</script>

<!-- HEADER -->
<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Purchase</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<Button
			onclick={() => goto('/purchase/create')}
			class="flex items-center justify-center rounded-full px-4 py-2"
		>
			<Icon icon="ic:round-plus" width="24" height="24" />
			New Purchase
		</Button>

		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search data purchase..."
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
<div class="overflow-x-auto rounded-lg border border-gray-200">
	<table class="min-w-full">
		<thead class="bg-gray-100">
			<tr class="text-left text-sm font-medium text-gray-700">
				<th class="px-4 py-3">No</th>
				<th class="px-4 py-3">Invoice No</th>
				<th class="px-4 py-3">Item ID</th>
				<th class="px-4 py-3">Customer ID</th>
				<th class="px-4 py-3">Point Used</th>
				<th class="px-4 py-3">Point Earned</th>
				<th class="px-4 py-3">Status</th>
				<th class="px-4 py-3">Total</th>
				<th class="px-4 py-3">Final</th>
				<th class="px-4 py-3">Discount</th>
				<th class="px-4 py-3">Payment</th>
				<th class="px-4 py-3 text-center">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="px-4 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{row.inv_number}</td>
					<td class="px-4 py-3">{row.item_id}</td>
					<td class="px-4 py-3">{row.cust_id}</td>
					<td class="px-4 py-3">{row.point_used}</td>
					<td class="px-4 py-3">{row.point_earned}</td>
					<td class="px-4 py-3">
						<span
							class={cn(
								'rounded-md px-2 py-1',
								row.status == 'Completed' && 'bg-green-500/10 text-green-700',
								row.status == 'Pending' && 'bg-yellow-500/10 text-yellow-700',
								row.status == 'Cancelled' && 'bg-red-500/10 text-red-700'
							)}
						>
							{row.status}
						</span>
					</td>
					<td class="px-4 py-3">Rp {row.total_amount.toLocaleString()}</td>
					<td class="px-4 py-3">Rp {row.final_amount.toLocaleString()}</td>
					<td class="px-4 py-3">Rp {row.discount_amount.toLocaleString()}</td>
					<td class="px-4 py-3">{row.payment_method}</td>
					<td class="px-4 py-3 text-center">
						<div class="flex items-center justify-center gap-3">
							<Icon
								icon="material-symbols-light:delete-rounded"
								width="20"
								height="20"
								class="cursor-pointer transition hover:scale-110"
								style="color: #ff0f22"
								onclick={() => openDeleteModal(row)}
							/>
							<Icon
								icon="lucide:edit"
								class="cursor-pointer transition hover:scale-110"
								width="16"
								height="16"
								style="color: #cea200"
							/>
						</div>
					</td>
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

<!-- 🧩 DELETE CONFIRM MODAL -->
{#if showDeleteModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<div class="w-[90%] rounded-2xl bg-white p-6 shadow-lg sm:w-[360px]">
			<h2 class="mb-3 text-lg font-semibold text-gray-800">Confirm Deletion</h2>
			<p class="mb-6 text-sm text-gray-600">
				Are you sure you want to delete
				<span class="font-semibold text-gray-800">{selectedRow?.inv_number}</span>? This action
				cannot be undone.
			</p>

			<div class="flex justify-end gap-3">
				<Button variant="outline" class="text-sm" onclick={closeDeleteModal}>Cancel</Button>
				<Button
					class="bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
					onclick={confirmDelete}
				>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
