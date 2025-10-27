<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { useTransactionPage } from './use-transaction.svelte';
	import { useTransactionForm } from '../search-form/form.svelte';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	const { state, handlePageChange, handleSearch } = useTransactionPage();
	const { state: pageState } = useTransactionForm();

	async function toggleSearch() {
		showSearch = !showSearch;

		if (showSearch) {
			// tunggu animasi mount selesai, lalu focus input
			await tick();
			searchEl?.focus();
		}
	}
	type TableRow = {
		id?: number;
		transactionName: string;
		open?: boolean;
	};

	function formatCurrency(num: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(num);
	}

	const transactions = [
		{
			id: 'TRX-001',
			date: 'Thu, 18 May 2025',
			customer: 'Dewi Kartika',
			type: 'Penjualan',
			items: [
				{
					name: 'Cincin Emas 22K asdas asdasd asdasd adsd',
					weight: 2,
					price_per_gram: 950000,
					total: 1900000
				},
				{
					name: 'Anting Emas 23K',
					weight: 1.5,
					price_per_gram: 980000,
					total: 1470000
				},
				{
					name: 'Anting Emas 23K',
					weight: 1.5,
					price_per_gram: 980000,
					total: 1470000
				},
				{
					name: 'Anting Emas 23K',
					weight: 1.5,
					price_per_gram: 980000,
					total: 1470000
				}
			]
		}
	];

	const totalAll = transactions.reduce(
		(acc, trx) => acc + trx.items.reduce((sum, i) => sum + i.total, 0),
		0
	);

	function formatToRupiah(value: string) {
		const number = value.replace(/\D/g, ''); // hapus semua non-digit
		if (!number) return '';

		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(parseInt(number));
	}
</script>

<div class="flex gap-4">
	<div class="mx-auto w-full max-w-7xl">
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
							>Barcode ID</th
						>
						<th
							class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
							>Item Name</th
						>
						<th
							class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
							>Label</th
						>
						<th
							class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
							>Harga Jual</th
						>
						<th
							class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
							>Action</th
						>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#if pageState.itemTable?.length > 0}
						{#each pageState.itemTable as row, index}
							<tr class="transition hover:bg-gray-50">
								<td class="px-3 py-2.5 whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
									>{index + 1}</td
								>
								<td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm"
									>{row.barcode_id}</td
								>
								<td class="px-3 py-2.5 font-medium whitespace-nowrap sm:px-4 sm:py-3 md:text-sm"
									>{row.name}</td
								>
								<td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm"
									>{row.label_name}</td
								>
								<td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3 md:text-sm">
									{formatCurrency(row.harga_jual)}
								</td>
								<td class="px-4 py-3 text-center">
									<Button
										class="flex items-center justify-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
										onclick={() => console.log('Add to cart:', row)}
									>
										<Icon icon="solar:cart-plus-bold" width="16" height="16" />
										Add
									</Button>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-4 text-center text-gray-500"> No data available </td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- PAGINATION -->
		<div class="w-full">
			<Pagination.Root count={pageState.totalCount} perPage={pageState.pageSize}>
				{#snippet children({ pages, currentPage })}
					<div class="mt-4 flex w-full justify-end">
						<Pagination.Content>
							<Pagination.Item class="hidden md:block">
								<Pagination.PrevButton
									onclick={() => handlePageChange(pageState.currentPage - 1)}
								/>
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
								<Pagination.NextButton
									onclick={() => handlePageChange(pageState.currentPage + 1)}
								/>
							</Pagination.Item>
						</Pagination.Content>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
	<div class="w-[35%] rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
		<!-- Header -->
		<div class="mb-4 flex items-start justify-between gap-2">
			<div class="flex items-center gap-2">
				<div class="bg-primary/10 rounded-md p-1.5">
					<Icon icon="hugeicons:transaction-history" width="24" height="24" />
				</div>
				<h2 class="text-[15px] font-semibold text-gray-800">Detail Transaksi</h2>
			</div>

			<!-- Total Semua -->
			<div class=" text-right font-semibold">
				<div>
					<span class=" text-xs font-bold">Total</span>
					<span class="ml-2 text-lg font-bold text-blue-600"
						>{formatCurrency(pageState.amount)}</span
					>
				</div>
				<div>
					<span class=" text-xs font-bold">Change</span>
					<span class="ml-2 text-sm font-medium text-orange-500">{formatCurrency(totalAll)}</span>
				</div>
			</div>
		</div>

		<!-- Loop Transaksi -->
		<div class="space-y-4">
			{#each transactions as trx, i}
				<div class="rounded-lg p-3">
					<div class="flex justify-between text-sm text-gray-600"></div>

					<div class="mt-2 rounded-md border border-gray-200">
						<div
							class="bg-primary/10 mb-2 flex items-center justify-between rounded-tl-md rounded-tr-md px-2"
						>
							<span class="text-primary rounded-md px-2 py-2 font-semibold">Items</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4 text-gray-600"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
							</svg>
						</div>

						<!-- Item Loop -->
						<div class="space-y-3 p-2 text-[13px] text-gray-600">
							{#each trx.items as item}
								<div class="flex justify-between">
									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class="max-w-28 truncate font-medium">
												<span class="max-w-28 truncate font-medium">{item.name}</span>
											</Tooltip.Trigger>
											<Tooltip.Content>{item.name}</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class="max-w-28 truncate font-medium">
												<span>{formatCurrency(item.total)}</span>
											</Tooltip.Trigger>
											<Tooltip.Content>{formatCurrency(item.total)}</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>

									<span>
										<span class="text-md w-3 px-2 font-medium">1</span>
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
