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
		id?: number;
		userName: string;
		role: string;
		open?: boolean;
	};

	const rows: TableRow[] = [
		{ id: 1, userName: 'Superadmin', role: 'Superadmin', open: true },
		{ id: 2, userName: 'Putri', role: 'Cashier', open: true },
		{ id: 3, userName: 'Putra', role: 'Technician', open: true },
		{ id: 4, userName: 'Arbi', role: 'Technician', open: true }
	];

	// 🔥 State untuk modal delete
	let showDeleteModal = false;
	let selectedUser: TableRow | null = null;

	function openDeleteModal(user: TableRow) {
		selectedUser = user;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedUser = null;
	}

	function confirmDelete() {
		if (selectedUser) {
			// aksi hapus (misalnya panggil API delete)
			console.log('Deleting user:', selectedUser.userName);

			// contoh hapus lokal
			const index = rows.findIndex((r) => r.id === selectedUser?.id);
			if (index !== -1) rows.splice(index, 1);

			closeDeleteModal();
		}
	}
</script>

<!-- HEADER -->
<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Master User</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<Button
			onclick={() => goto('/master/user/create')}
			class="flex items-center justify-center rounded-full px-4 py-2"
		>
			<Icon icon="ic:round-plus" width="24" height="24" />
			New User
		</Button>

		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Search user..."
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
				<th class="px-4 py-3">User Name</th>
				<th class="px-4 py-3">Role</th>
				<th class="px-4 py-3 text-center">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="w-20 px-4 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{row.userName}</td>
					<td class="px-4 py-3">
						<span
							class={cn(
								'bg-primary/10 text-primary rounded-md px-2 py-1',
								row.role == 'Superadmin' && 'bg-green-500/10 text-green-700',
								row.role == 'Cashier' && 'bg-blue-500/10 text-blue-700',
								row.role == 'Technician' && 'bg-yellow-500/10 text-yellow-700'
							)}
						>
							{row.role}
						</span>
					</td>
					<td class="w-10 px-4 py-3">
						{#if row.open}
							<div class="flex items-center justify-center gap-3">
								<Icon
									icon="material-symbols-light:delete-rounded"
									width="20"
									height="20"
									class="cursor-pointer transition hover:scale-110"
									style="color: #ff0f22"
									on:click={() => openDeleteModal(row)}
								/>
								<Icon
									icon="lucide:edit"
									class="cursor-pointer transition hover:scale-110"
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
				<span class="font-semibold text-gray-800">{selectedUser?.userName}</span>? This action
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
