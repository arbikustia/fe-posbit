<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
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

<!-- HEADER -->
<header class="mb-4 sm:mb-6 md:mb-8">
	<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
		<Button
			variant="ghost"
			class="flex w-28 cursor-default items-center justify-center gap-2 rounded-full bg-transparent px-0 py-2 text-xs hover:bg-transparent sm:w-auto md:w-fit md:text-sm"
		>
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
					Report Invoice
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
				<th class="px-3 py-2.5 sm:px-4 sm:py-3">No</th>
				<th class="px-3 py-2.5 sm:px-4 sm:py-3">Invoice ID</th>
				<th class="px-3 py-2.5 sm:px-4 sm:py-3">Description</th>
				<!-- <th class="px-3 py-2.5 text-center sm:px-4 sm:py-3">Action</th> -->
			</tr>
		</thead>

		<tbody class="divide-y divide-gray-200 bg-white">
			{#each rows as row, index}
				<tr class="transition hover:bg-gray-50">
					<td class="px-3 py-2.5 text-xs text-gray-500 sm:px-4 sm:py-3 md:text-sm">{index + 1}</td>
					<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm">{row.inv_id}</td>
					<td class="px-3 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 md:text-sm"
						>{row.description}</td
					>
					<!-- <td class="px-3 py-2.5 text-center sm:px-4 sm:py-3">
						<div class="flex items-center justify-center gap-2 md:gap-3">
							<button
								type="button"
								onclick={() => openDeleteModal(row)}
								class="rounded-full p-1.5 transition hover:scale-110 hover:bg-red-50 md:p-2"
							>
								<Icon
									icon="material-symbols-light:delete-rounded"
									width="18"
									height="18"
									style="color: #ff0f22"
								/>
							</button>
							<button
								type="button"
								class="rounded-full p-1.5 transition hover:scale-110 hover:bg-yellow-50 md:p-2"
							>
								<Icon icon="lucide:edit" width="16" height="16" style="color: #cea200" />
							</button>
						</div>
					</td> -->
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
								<Pagination.Link {page} isActive={currentPage === page.value}
									>{page.value}</Pagination.Link
								>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item class="hidden md:block"><Pagination.NextButton /></Pagination.Item>
				</Pagination.Content>
			</div>
		{/snippet}
	</Pagination.Root>
</div>

<!-- DELETE MODAL -->
{#if showDeleteModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
		onclick={closeDeleteModal}
		transition:fly={{ y: 10, duration: 250 }}
	>
		<div
			class="relative w-full max-w-[90%] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:max-w-md sm:p-6 dark:border-gray-700 dark:bg-gray-900"
			onclick={(e) => e.stopPropagation()}
			transition:fly={{ y: 15, duration: 200 }}
		>
			<div
				class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 sm:mb-4 sm:h-14 sm:w-14"
			>
				<Icon
					icon="material-symbols:warning-rounded"
					width="28"
					height="28"
					class="sm:h-8 sm:w-8"
				/>
			</div>

			<h2
				class="mb-2 text-center text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100"
			>
				Delete Confirmation
			</h2>

			<p class="mb-5 text-center text-sm text-gray-600 sm:mb-6 dark:text-gray-400">
				Are you sure you want to delete
				<span class="font-semibold text-gray-800 dark:text-gray-100">{selectedInvoice?.inv_id}</span
				>?
				<span class="block sm:inline">This action cannot be undone.</span>
			</p>

			<div class="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
				<Button
					variant="outline"
					class="w-full rounded-full px-4 py-2 text-sm transition hover:bg-gray-100 sm:w-auto dark:hover:bg-gray-800"
					onclick={closeDeleteModal}
				>
					Cancel
				</Button>

				<Button
					class="w-full rounded-full bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 sm:w-auto"
					onclick={confirmDelete}
				>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
