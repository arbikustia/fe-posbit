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
			// tunggu animasi mount selesai, lalu focus input
			await tick();
			searchEl?.focus();
		}
	}
	type TableRow = {
		id?: number;
		locationName: string;
		open?: boolean;
	};

	const rows: TableRow[] = [
		{
			id: 1,
			locationName: 'Yogyakarta',
			open: true
		},
		{
			id: 2,
			locationName: 'Solo',
			open: true
		},
		{
			id: 3,
			locationName: 'Semarang',
			open: true
		},
		{
			id: 4,
			locationName: 'Malang',
			open: true
		}
	];
</script>

<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Master Location</h1>
	</div>

	<div class="mt-6 flex relative rounded-full w-full flex-row justify-between gap-4">
		<Button
			onclick={() => goto('/master/location/create')}
			class="flex items-center justify-center rounded-full px-4 py-2"
		>
			<Icon icon="ic:round-plus" width="24" height="24" />
			New Location
		</Button>

		<div class="flex w-fit  flex-row items-center justify-end gap-1 rounded-full ">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search location..."
						class="w-56 bg-primary/10 rounded-full border-none px-3 py-2 text-sm shadow-sm transition outline-none"
					/>
				{/if}
			</div>

			<button
				type="button"
				class="rounded-full p-2 absolute right-0 transition dark:hover:bg-gray-800"
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
				<th class="px-4 py-3">Location Name</th>
				<th class="px-4 text-center py-3">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="px-4 w-20 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{row.locationName}</td>
					<td class="px-4 w-10 py-3">
						{#if row.open}
							<div class="flex items-center gap-2">
								<Icon
									icon="material-symbols-light:delete-rounded"
									width="20"
									height="20"
									class="cursor-pointer"
									style="color: #ff0f22"
								/>
								<Icon icon="lucide:edit" class="cursor-pointer" width="16" height="16" style="color: #cea200" />
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
