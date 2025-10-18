<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import SearchForm from '../search-form/search-form.svelte';
	import { cn } from '$lib/utils';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

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

	const rows = [
		{
			category: 'Gelang',
			productName: 'Gelang Emas Klasik 24K',
			price: 3450000,
			image: 'https://images.unsplash.com/photo-1590080875831-3c5d3b6b7a45',
			open: true
		},
		{
			category: 'Cincin',
			productName: 'Cincin Emas Berlian 18K',
			price: 5280000,
			image: 'https://images.unsplash.com/photo-1600180758890-6c1a7b1b7c9e',
			open: true
		},
		{
			category: 'Kalung',
			productName: 'Kalung Emas Rantai Halus 22K',
			price: 6750000,
			image: 'https://images.unsplash.com/photo-1610375461246-87d0d84d1b97',
			open: true
		},
		{
			category: 'Anting',
			productName: 'Anting Emas Mutiara 20K',
			price: 4150000,
			image: 'https://images.unsplash.com/photo-1617039546637-df84b08b52b2',
			open: true
		},
		{
			category: 'Liontin',
			productName: 'Liontin Emas Putih Berlian',
			price: 7350000,
			image: 'https://images.unsplash.com/photo-1618858466601-8f7f1a9a9f90',
			open: true
		}
	];

	const formatPrice = (num: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

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

	let rawValue = ''; // nilai mentah (tanpa format)
	let formattedValue = ''; // nilai dengan format rupiah

	function formatToRupiah(value: string) {
		const number = value.replace(/\D/g, ''); // hapus semua non-digit
		if (!number) return '';

		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(parseInt(number));
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		rawValue = target.value.replace(/\D/g, '');
		formattedValue = formatToRupiah(rawValue);

		// set tampilan input jadi format Rupiah
		target.value = formattedValue;
	}
</script>

<div class="flex gap-4">
	<div class="w-[65%]">
		<table class="w-full overflow-hidden rounded-lg border border-gray-200">
			<thead class="bg-primary/10">
				<tr class="text-left text-sm font-medium text-gray-700">
					<th class="px-4 py-3">No</th>
					<th class="px-4 py-3">Category</th>
					<th class="px-4 py-3">Product Name</th>
					<th class="px-4 py-3">Price</th>
					<th class="px-4 py-3">Image</th>
					<th class="px-4 py-3 text-center">Action</th>
				</tr>
			</thead>

			<tbody>
				{#each rows as row, index}
					<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
						<td class="w-20 px-4 py-3 text-gray-500">{index + 1}</td>
						<td class="px-4 py-3">{row.category}</td>
						<td class="px-4 py-3">{row.productName}</td>
						<td class="px-3 py-3">
							<span class="bg-primary/10 text-primary rounded-sm p-1 px-2 font-medium"
								>{formatPrice(row.price)}</span
							>
						</td>
						<td class="px-4 py-3 text-blue-700">
							<a href={row.image} target="_blank"> Image </a>
						</td>
						<td class="w-10 px-4 py-3 text-center">
							{#if row.open}
								<div class="flex items-center justify-center gap-2">
									<Icon
										icon="solar:cart-plus-bold"
										width="24"
										height="24"
										class="cursor-pointer text-green-500"
									/>
								</div>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<Pagination.Root count={100} perPage={10}>
			{#snippet children({ pages, currentPage })}
				<div class="flex w-full justify-end">
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton />
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton />
						</Pagination.Item>
					</Pagination.Content>
				</div>
			{/snippet}
		</Pagination.Root>
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
					<span class="ml-2 text-lg font-bold text-blue-600">{formatCurrency(totalAll)}</span>
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
							<span class="text-primary rounded-md px-2 py-2 font-semibold">Products</span>
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
										<Button class="h-5 w-1">-</Button>
										<span class="text-md w-3 px-2 font-medium">5</span>
										<Button class="h-5 w-1">+</Button>
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
