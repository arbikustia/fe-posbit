<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
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

	type TableRow = {
		id?: number;
		category: string;
		productName: string;
		price: number;
		image: string;
		open?: boolean;
	};

	const rows: TableRow[] = [
		{
			id: 1,
			category: 'Kalung',
			productName: 'Kalung Emas Rantai 24K',
			price: 6750000,
			image: 'https://images.unsplash.com/photo-1610375461246-87d0d84d1b97',
			open: true
		},
		{
			id: 2,
			category: 'Gelang',
			productName: 'Gelang Emas Halus 22K',
			price: 4450000,
			image: 'https://images.unsplash.com/photo-1590080875831-3c5d3b6b7a45',
			open: true
		},
		{
			id: 3,
			category: 'Cincin',
			productName: 'Cincin Emas Berlian 18K',
			price: 5280000,
			image: 'https://images.unsplash.com/photo-1600180758890-6c1a7b1b7c9e',
			open: true
		},
		{
			id: 4,
			category: 'Anting',
			productName: 'Anting Emas Mutiara 20K',
			price: 4150000,
			image: 'https://images.unsplash.com/photo-1617039546637-df84b08b52b2',
			open: true
		},
		{
			id: 5,
			category: 'Liontin',
			productName: 'Liontin Emas Putih Berlian',
			price: 7350000,
			image: 'https://images.unsplash.com/photo-1618858466601-8f7f1a9a9f90',
			open: true
		},
		{
			id: 6,
			category: 'Gelang',
			productName: 'Gelang Rantai Motif Bunga 22K',
			price: 4900000,
			image: 'https://images.unsplash.com/photo-1593032465171-8b11f99a9a1d',
			open: true
		}
	];

	const formatPrice = (num: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
</script>

<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Master Product</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<Button
			onclick={() => goto('/master/product/create')}
			class="flex items-center justify-center rounded-full px-4 py-2"
		>
			<Icon icon="ic:round-plus" width="24" height="24" />
			New Product
		</Button>

		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search product..."
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

<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full">
		<thead class="bg-gray-100">
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
					<td class="px-4 py-3">
						<span class="bg-primary/10 py-1 px-2 rounded-md text-primary font-medium">
							{formatPrice(row.price)}
						</span>
					</td>
					<td class="px-4 py-3 text-blue-700">
						<a href={row.image} target="_blank"> Image </a>
					</td>
					<td class="w-10 px-4 py-3">
						{#if row.open}
							<div class="flex items-center gap-2">
								<Icon
									icon="material-symbols-light:delete-rounded"
									width="20"
									height="20"
									class="cursor-pointer"
									style="color: #ff0f22"
								/>
								<Icon
									icon="lucide:edit"
									class="cursor-pointer"
									width="16"
									height="16"
									style="color: #cea200"
								/>
							</div>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

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
