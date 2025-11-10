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
	import { useUserPage } from '../../create/use-create.svelte.js';
	import { userService } from '@/services/userService.js';

	const { state, handlePageChange } = useUserPage();

	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		}
	}

	type TableRow = {
		id?: number;
		username: string;
		password: string;
		role: string;
		email: string;
		last_created: string;
		open?: boolean;
	};

	// 🔥 State untuk modal delete

	function openDeleteModal(user: TableRow) {
		state.selectedUser = user;
		state.showDeleteModal = true;
	}

	function closeDeleteModal() {
		state.showDeleteModal = false;
		state.selectedUser = null;
	}

	function confirmDelete() {
		if (state.selectedUser) {
			console.log('Deleting user:', state.selectedUser);
			userService
				.delete(state.selectedUser.id)
				.then(() => {
					console.log('User deleted successfully');
					state.table = state.table.filter((r: any) => r.id !== state.selectedUser?.id);
					closeDeleteModal();
				})
				.catch((error) => {
					console.error('User already used elsewhere:');
				});
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
						{#if state.showSearch}
							<input
								bind:value={state.searchTerm}
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
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Email
								</th>
								<th
									scope="col"
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Last Updated
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
							{#each state.table as row, index}
								<tr class="transition hover:bg-gray-50">
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
									>
										{index + 1}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.username}
									</td>
									<td class="px-3 py-2.5 whitespace-nowrap sm:px-4 sm:py-3">
										<span
											class={cn(
												'inline-flex rounded-md px-2 py-0.5 text-xs font-medium md:py-1 md:text-sm',
												row.role == 'Admin' && 'bg-green-500/10 text-green-700',
												row.role == 'Cashier' && 'bg-blue-500/10 text-blue-700',
												row.role == 'Gudang' && 'bg-yellow-500/10 text-yellow-700'
											)}
										>
											{row.role}
										</span>
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.email}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.last_created}
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
													onclick={() =>
														goto(
															`/master/user/create?username=${encodeURIComponent(
																row.username
															)}&role=${encodeURIComponent(row.role)}&email=${encodeURIComponent(
																row.email ?? ''
															)}&id=${encodeURIComponent(String(row.id ?? ''))}&password=${encodeURIComponent(
																String(row.password ?? '')
															)}`
														)}
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
			<Pagination.Root count={state.totalCount} perPage={state.pageSize}>
				{#snippet children({ pages, currentPage })}
					<div class="mt-4 flex w-full justify-end">
						<Pagination.Content>
							<Pagination.Item class="hidden md:block">
								<Pagination.PrevButton onclick={() => handlePageChange(state.currentPage - 1)} />
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
								<Pagination.NextButton onclick={() => handlePageChange(state.currentPage + 1)} />
							</Pagination.Item>
						</Pagination.Content>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
</div>

<!-- 🧩 DELETE CONFIRM MODAL -->
{#if state.showDeleteModal}
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
				<span class="font-semibold text-gray-800 dark:text-gray-100"
					>{state.selectedUser?.username}</span
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
