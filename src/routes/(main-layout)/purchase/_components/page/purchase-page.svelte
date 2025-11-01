<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { usePurchasePage } from '../../create/use-create.svelte'; // ✅ pastikan path ini benar
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'; // pastikan path sesuai
	import { purchaseService } from '@/services/purchaseService';

	// ✅ Ambil state & logic dari composable
	const { state, handleGetPaged, handlePageChange } = usePurchasePage();

	// 🧩 TOGGLE SEARCH
	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		}
	}

	type TableRow = {
		id: number;
		inv_number: string;
		customer_name: string;
		total_amount: number;
		final_amount: number;
		status: string;
		payment_method: string;
		open?: boolean;
	};

	// 🧩 FETCH DATA DARI API SAAT LOAD
	onMount(async () => {
		await handleGetPaged();
	});

	// 🧩 DELETE MODAL
	function openDeleteModal(row: TableRow) {
		state.selectedPurchase = row;
		state.showDeleteModal = true;
	}

	function closeDeleteModal() {
		state.showDeleteModal = false;
		state.selectedPurchase = null;
	}

	async function confirmDelete() {
		if (state.selectedPurchase) {
			purchaseService.delete(state.selectedPurchase.id);
			state.table = state.table.filter((r: any) => r.id !== state.selectedPurchase?.id);
			closeDeleteModal();
		}
	}
</script>

<div class="w-full">
	<div class="mx-auto max-w-7xl">
		<!-- HEADER -->
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">Purchase</h1>
			</div>

			<div
				class="mt-3 flex flex-row gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between md:mt-6"
			>
				<!-- New Purchase Button -->
				<Button
					onclick={() => goto('/purchase/create')}
					class="flex w-32 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs sm:w-auto sm:px-6 md:w-fit md:text-sm"
				>
					<Icon icon="ic:round-plus" width="20" height="20" class="md:h-6 md:w-6" />
					<span>New Purchase</span>
				</Button>

				<!-- Search -->
				<div class="relative flex w-full items-center justify-end sm:w-auto">
					<div class="overflow-hidden">
						{#if state.showSearch}
							<input
								bind:this={state.searchEl}
								transition:fly={{ x: 120, duration: 250 }}
								placeholder="Search purchase..."
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
			<div class="inline-block min-w-full align-middle">
				<div class="overflow-hidden">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-100">
							<tr>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">No</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Invoice No</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Customer</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Status</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Total</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Payment</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Created By</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Created At</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700"
									>Order Details</th
								>
								<th class="px-3 py-2.5 text-center text-xs font-medium text-gray-700">Action</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-gray-100">
							{#each state.table as row}
								<tr class="hover:bg-gray-50">
									<td class="px-3 py-2.5 text-xs text-gray-500">{row.no}</td>
									<td class="px-3 py-2.5 text-xs">{row.inv_number}</td>
									<td class="px-3 py-2.5 text-xs">
										{#if row.person_id}
											<Popover>
												<PopoverTrigger
													class="cursor-pointer text-start text-xs font-medium text-blue-500 underline hover:text-blue-600"
												>
													{row.customer_name}
												</PopoverTrigger>

												<PopoverContent
													class="max-h-60 w-64 overflow-y-auto rounded-lg bg-white p-3 shadow-lg"
												>
													<p class="mb-2 text-sm font-semibold text-gray-700">Customer Details</p>

													<table class="min-w-full text-xs">
														<tbody>
															<tr>
																<td class="py-1 font-medium text-gray-700">ID</td>
																<td class="py-1 text-gray-700">{row.person_id}</td>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">First Name</td>
																<td class="py-1 text-gray-700">{row.customer_name.split(' ')[0]}</td
																>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">Last Name</td>
																<td class="py-1 text-gray-700"
																	>{row.customer_name.split(' ').slice(1).join(' ')}</td
																>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">Customer Code</td>
																<td class="py-1 text-gray-700">{row.customer_code}</td>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">Telephone</td>
																<td class="py-1 text-gray-700">{row.telephone}</td>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">Mobile</td>
																<td class="py-1 text-gray-700">{row.mobile}</td>
															</tr>
															<tr>
																<td class="py-1 font-medium text-gray-700">Type</td>
																<td class="py-1 text-gray-700">{row.person_type ?? 'Customer'}</td>
															</tr>
														</tbody>
													</table>
												</PopoverContent>
											</Popover>
										{:else}
											<span class="text-xs text-gray-400 italic">No customer</span>
										{/if}
									</td>

									<td class="px-3 py-2.5 text-xs">{row.status}</td>
									<td class="px-3 py-2.5 text-xs">Rp {row.total_amount.toLocaleString()}</td>
									<td class="px-3 py-2.5 text-xs">{row.payment_method}</td>
									<td class="px-3 py-2.5 text-xs">{row.created_by}</td>
									<td class="px-3 py-2.5 text-xs">{row.created_at}</td>

									<!-- 🔹 Order Details Popover -->
									<td class="px-3 py-2.5 text-xs">
										{#if row.purchase_order_details?.length > 0}
											<Popover>
												<PopoverTrigger
													class="cursor-pointer text-xs font-medium text-blue-500 underline hover:text-blue-600"
												>
													See more
												</PopoverTrigger>

												<PopoverContent
													class="max-h-60 w-92 overflow-y-auto rounded-lg bg-white p-3 shadow-lg"
												>
													<p class="mb-2 text-sm font-semibold text-gray-700">Order Details</p>

													<table class="min-w-full text-xs">
														<thead>
															<tr class="border-b border-gray-200 text-gray-500">
																<th class="py-1 text-left">Item ID</th>
																<th class="py-1 text-left">Name</th>
																<th class="py-1 text-left">Desc</th>
																<th class="py-1 text-left">Qty</th>
															</tr>
														</thead>
														<tbody>
															{#each row.purchase_order_details as detail}
																<tr>
																	<td class="py-1 text-gray-700">{detail.item_id}</td>
																	<td class="py-1 text-gray-700">{detail.name}</td>
																	<td class="py-1 text-gray-700">{detail.description}</td>
																	<td class="py-1 text-gray-700">{detail.qty}</td>
																</tr>
															{/each}
														</tbody>
													</table>
												</PopoverContent>
											</Popover>
										{:else}
											<span class="text-xs text-gray-400 italic">No details</span>
										{/if}
									</td>

									<!-- 🔹 Actions -->
									<td class="px-3 py-2.5 text-center whitespace-nowrap sm:px-4 sm:py-3">
										{#if row.open}
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
														class="md:h-5 md:w-5"
														style="color: #ff0f22"
													/>
												</button>

												<button
													type="button"
													class="rounded-full p-1.5 transition hover:scale-110 hover:bg-yellow-50 md:p-2"
													onclick={() =>
														goto(
															`/purchase/create?id=${row.id}&customer_id=${row.customer_id}&status=${row.status}&payment_method=${row.payment_method}&total=${row.total_amount}&final=${row.final_amount}`
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
				<span class="font-semibold text-gray-800 dark:text-gray-100"
					>{state.selectedPurchase?.inv_number}</span
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
