<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
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

	type InvoiceRow = {
		id: number;
		inv_id: string;
		description: string;
		open?: boolean;
	};

	let rows: InvoiceRow[] = [
		{ id: 1, inv_id: 'INV001', description: 'Purchase electronics', open: true },
		{ id: 2, inv_id: 'INV002', description: 'Software license renewal', open: true },
		{ id: 3, inv_id: 'INV003', description: 'Office equipment', open: true }
	];

	let showDeleteModal = false;
	let selectedInvoice: InvoiceRow | null = null;

	function openDeleteModal(row: InvoiceRow) {
		selectedInvoice = row;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedInvoice = null;
	}

	function confirmDelete() {
		if (selectedInvoice) {
			rows = rows.filter((r) => r.id !== selectedInvoice?.id);
			closeDeleteModal();
		}
	}
</script>

<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Report Invoice</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<Button onclick={() => goto('/report/invoice/create')} class="flex items-center rounded-full px-4 py-2">
			<Icon icon="ic:round-plus" width="24" height="24" />
			New Invoice
		</Button>

		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search invoice..."
						class="w-56 rounded-full border-none bg-primary/10 px-3 py-2 text-sm shadow-sm outline-none"
					/>
				{/if}
			</div>

			<button
				type="button"
				class="absolute right-0 rounded-full p-2 transition dark:hover:bg-gray-800"
				onclick={toggleSearch}
			>
				<Icon icon="majesticons:search-line" width="22" height="22" class="text-gray-600" />
			</button>
		</div>
	</div>
</header>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full">
		<thead class="bg-gray-100">
			<tr class="text-left text-sm font-medium text-gray-700">
				<th class="px-4 py-3">No</th>
				<th class="px-4 py-3">Invoice ID</th>
				<th class="px-4 py-3">Description</th>
				<th class="px-4 py-3 text-center">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="px-4 py-3">{index + 1}</td>
					<td class="px-4 py-3">{row.inv_id}</td>
					<td class="px-4 py-3">{row.description}</td>
					<td class="w-10 px-4 py-3">
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
								width="16"
								height="16"
								class="cursor-pointer transition hover:scale-110"
								style="color: #cea200"
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

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

{#if showDeleteModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
		transition:fly={{ y: 10, duration: 250 }}
	>
		<div
			class="relative w-[90%] sm:w-[380px] rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-2xl backdrop-blur-md dark:bg-gray-900/90"
			in:fly={{ y: 15, duration: 200 }}
			out:fly={{ y: -10, duration: 150 }}
		>
			<!-- Icon Header -->
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
				<Icon icon="material-symbols:warning-rounded" width="32" height="32" />
			</div>

			<!-- Title -->
			<h2 class="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
				Delete Confirmation
			</h2>

			<!-- Message -->
			<p class="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
				Are you sure you want to delete
				<span class="font-semibold text-gray-800 dark:text-white">
					{selectedInvoice?.inv_id}
				</span>
				from your invoice report? This action cannot be undone.
			</p>

			<!-- Buttons -->
			<div class="flex justify-center gap-3">
				<Button
					variant="outline"
					class="rounded-full px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
					onclick={closeDeleteModal}
				>
					Cancel
				</Button>

				<Button
					class="rounded-full bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
					onclick={confirmDelete}
				>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
