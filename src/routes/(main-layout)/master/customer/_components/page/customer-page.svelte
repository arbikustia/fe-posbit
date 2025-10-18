<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		}
	}

	type Customer = {
		id: number;
		customer_name: string;
		phone: string;
		is_member: boolean;
		member_since?: string;
		member_code?: string;
		point?: number;
		open?: boolean;
	};

	const customers: Customer[] = [
		{
			id: 1,
			customer_name: 'Arbi Kustia',
			phone: '081234567890',
			is_member: true,
			member_since: '2023-05-01',
			member_code: 'MBR001',
			point: 120,
			open: true
		},
		{
			id: 2,
			customer_name: 'Putri Nanda',
			phone: '081987654321',
			is_member: false,
			member_since: '',
			member_code: '',
			point: 0,
			open: true
		}
	];

	let showDeleteModal = false;
	let selectedCustomer: Customer | null = null;

	function openDeleteModal(customer: Customer) {
		selectedCustomer = customer;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedCustomer = null;
	}

	function confirmDelete() {
		if (selectedCustomer) {
			const index = customers.findIndex((r) => r.id === selectedCustomer?.id);
			if (index !== -1) customers.splice(index, 1);
			closeDeleteModal();
		}
	}
</script>

<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Customer List</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<Button
			onclick={() => goto('/master/customer/create')}
			class="flex items-center justify-center rounded-full px-4 py-2"
		>
			<Icon icon="ic:round-plus" width="24" height="24" />
			New Customer
		</Button>

		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search customer..."
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
				<th class="px-4 py-3">Customer Name</th>
				<th class="px-4 py-3">Phone</th>
				<th class="px-4 py-3">Member</th>
				<th class="px-4 py-3">Member Code</th>
				<th class="px-4 py-3">Point</th>
				<th class="px-4 py-3 text-center">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each customers as c, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="w-16 px-4 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{c.customer_name}</td>
					<td class="px-4 py-3">{c.phone}</td>
					<td class="px-4 py-3">
						<span
							class={cn(
								'rounded-md px-2 py-1',
								c.is_member
									? 'bg-green-500/10 text-green-700'
									: 'bg-red-500/10 text-red-700'
							)}
						>
							{c.is_member ? 'Yes' : 'No'}
						</span>
					</td>
					<td class="px-4 py-3">{c.member_code || '-'}</td>
					<td class="px-4 py-3">{c.point}</td>
					<td class="w-10 px-4 py-3">
						<div class="flex items-center justify-center gap-3">
							<Icon
								icon="material-symbols-light:delete-rounded"
								width="20"
								height="20"
								class="cursor-pointer transition hover:scale-110"
								style="color: #ff0f22"
								onclick={() => openDeleteModal(c)}
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

{#if showDeleteModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<div class="w-[90%] rounded-2xl bg-white p-6 shadow-lg sm:w-[360px]">
			<h2 class="mb-3 text-lg font-semibold text-gray-800">Confirm Deletion</h2>
			<p class="mb-6 text-sm text-gray-600">
				Delete customer
				<span class="font-semibold text-gray-800">{selectedCustomer?.customer_name}</span>?
			</p>
			<div class="flex justify-end gap-3">
				<Button variant="outline" class="text-sm" onclick={closeDeleteModal}>Cancel</Button>
				<Button class="bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" onclick={confirmDelete}>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
