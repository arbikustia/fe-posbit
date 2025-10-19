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

	let showSearch = $state(false);
	let searchEl: HTMLInputElement | null = $state(null);

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

	let rows = $state<TableRow[]>([
		{ id: 1, userName: 'Superadmin', role: 'Superadmin', open: true },
		{ id: 2, userName: 'Putri', role: 'Cashier', open: true },
		{ id: 3, userName: 'Putra', role: 'Technician', open: true },
		{ id: 4, userName: 'Arbi', role: 'Technician', open: true }
	]);

	// 🔥 State untuk modal delete
	let showDeleteModal = $state(false);
	let selectedUser = $state<TableRow | null>(null);

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
			console.log('Deleting user:', selectedUser.userName);
			rows = rows.filter((r) => r.id !== selectedUser?.id);
			closeDeleteModal();
		}
	}
</script>

<div class="w-full">
	<div class="mx-auto max-w-7xl">
		<!-- HEADER -->
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
					Master User
				</h1>
			</div>

			<div
				class="mt-3 flex flex-row gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between md:mt-6"
			>
				<!-- New User Button -->
				<Button
					onclick={() => goto('/master/user/create')}
					class="flex w-28 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs sm:w-auto sm:px-4 md:w-fit md:text-sm"
				>
					<Icon icon="ic:round-plus" width="20" height="20" class="md:h-6 md:w-6" />
					<span>New User</span>
				</Button>

				<!-- Search Container -->
				<div class="relative flex w-full items-center justify-end sm:w-auto">
					<div class="overflow-hidden">
						{#if showSearch}
							<input
								bind:this={searchEl}
								transition:fly={{ x: 120, duration: 250 }}
								placeholder="Search user..."
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

		<!-- TABLE - Horizontal Scroll Container -->
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
			<div class="inline-block min-w-full align-middle">
				<div class="overflow-hidden">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-100">
							<tr>
								<th
									scope="col"
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									No
								</th>
								<th
									scope="col"
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									User Name
								</th>
								<th
									scope="col"
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Role
								</th>
								<th
									scope="col"
									class="px-3 py-2.5 text-center text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each rows as row, index}
								<tr class="transition hover:bg-gray-50">
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
									>
										{index + 1}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.userName}
									</td>
									<td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3">
										<span
											class={cn(
												'inline-flex rounded-md px-2 py-0.5 text-xs font-medium md:py-1 md:text-sm',
												row.role == 'Superadmin' && 'bg-green-500/10 text-green-700',
												row.role == 'Cashier' && 'bg-blue-500/10 text-blue-700',
												row.role == 'Technician' && 'bg-yellow-500/10 text-yellow-700'
											)}
										>
											{row.role}
										</span>
									</td>
									<td class="px-3 py-2.5 text-center whitespace-nowrap sm:px-4 sm:py-3">
										{#if row.open}
											<div class="flex items-center justify-center gap-2 md:gap-3">
												<button
													type="button"
													onclick={() => openDeleteModal(row)}
													class="rounded-full p-1.5 transition hover:scale-110 hover:bg-red-50 md:p-2"
													aria-label="Delete user"
												>
													<Icon
														icon="material-symbols-light:delete-rounded"
														width="18"
														height="18"
														class="md:h-5 md:w-5"
														style="color: #ff0f22"
													/>
												</button>
												<button
													type="button"
													class="rounded-full p-1.5 transition hover:scale-110 hover:bg-yellow-50 md:p-2"
													aria-label="Edit user"
												>
													<Icon
														icon="lucide:edit"
														width="16"
														height="16"
														class="md:h-[18px] md:w-[18px]"
														style="color: #cea200"
													/>
												</button>
											</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
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
										<Pagination.Link {page} isActive={currentPage === page.value}>
											{page.value}
										</Pagination.Link>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item class="hidden md:block"><Pagination.NextButton /></Pagination.Item>
						</Pagination.Content>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
</div>

<!-- 🧩 DELETE CONFIRM MODAL -->
{#if showDeleteModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
		onclick={closeDeleteModal}
		transition:fly={{ y: 10, duration: 250 }}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="relative w-full max-w-[90%] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:max-w-md sm:p-6 dark:border-gray-700 dark:bg-gray-900"
			onclick={(e) => e.stopPropagation()}
			transition:fly={{ y: 15, duration: 200 }}
		>
			<!-- Icon Header -->
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

			<!-- Title -->
			<h2
				class="mb-2 text-center text-base font-semibold text-gray-800 sm:text-lg dark:text-gray-100"
			>
				Delete Confirmation
			</h2>

			<!-- Message -->
			<p class="mb-5 text-center text-sm text-gray-600 sm:mb-6 dark:text-gray-400">
				Are you sure you want to delete
				<span class="font-semibold text-gray-800 dark:text-gray-100">{selectedUser?.userName}</span
				>?
				<span class="block sm:inline">This action cannot be undone.</span>
			</p>

			<!-- Buttons -->
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
