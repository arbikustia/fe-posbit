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
	import { pointService } from '$lib/services/pointService.js';

	import { stoService } from '@/services/stoService';
	import { useStoDetailPage } from '../../use-detail.svelte';

	const { state, handlePageChange, scanBarcode } = useStoDetailPage();
	const { id } = $props();

	async function toggleSearch() {
		state.showSearch = !state.showSearch;
		if (state.showSearch) {
			await tick();
			state.searchEl?.focus();
		}
	}

	type TableRow = {
		id?: number;
		amount_per_point: string;
		point_value: string;
		is_active: boolean;
		updated_at: string;
		open?: boolean;
	};

	// 🧩 DELETE MODAL
	function openDeleteModal(point: TableRow) {
		state.selectedSto = point;
		state.showDeleteModal = true;
	}

	function closeDeleteModal() {
		state.showDeleteModal = false;
		state.selectedSto = null;
	}

	async function confirmDelete() {
		if (state.selectedSto) {
			try {
				await stoService.delete(state.selectedSto.id);
				state.table = state.table.filter((r: any) => r.id !== state.selectedSto?.id);
				closeDeleteModal();
			} catch (err) {
				console.error('Failed to delete STO:', err);
			}
		}
	}
	function downloadExcel() {
		stoService.getDetailExcel({
			PageNumber: 1,
			PageSize: state.pageSize,
			SearchTerm: state.searchTerm,
			id: id
		});
	}
</script>

<div class="container w-full space-y-5">
	<div class="mx-auto max-w-7xl">
		<!-- HEADER -->
		<header class="mb-4 sm:mb-6 md:mb-8">
			<div class="flex items-center justify-start gap-3">
				<span>
					<Button
						variant="outline"
						onclick={() => goto('/sto')}
						class="flex items-center justify-center"
					>
						<Icon icon="solar:arrow-left-line-duotone" width="24" height="24" />
						<span>Back</span>
					</Button>
				</span>
				<h1
					class="flex space-x-3 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl"
				>
					<span>STO Data Detail</span>
					<div
						class="flex items-center justify-center rounded-md border border-blue-500 bg-blue-500/10 px-2 text-xs font-normal text-blue-700"
					>
						Data {state.totalCount}
					</div>
				</h1>
			</div>

			<div
				class="s mt-3 flex flex-row justify-between gap-3 sm:mt-4 sm:flex-row sm:items-center md:mt-6"
			>
				<div class="flex flex-row items-center gap-3">
					{#if state.isScanning}
						<Input placeholder="Scanning..." readonly class="w-56" />
					{:else}
						<Input placeholder="Scan Barcode" onkeyup={(e) => scanBarcode(e)} class="w-56" />
					{/if}

					<div class="rounded-md border border-green-500 bg-green-500/10 px-2 py-1 text-green-700">
						Data Sudah di Scan {state.sudahScanCount}
					</div>
					<div class="rounded-md border border-red-500 bg-red-500/10 px-2 py-1 text-red-700">
						Data Belum di Scan {state.belumScanCount}
					</div>
				</div>
				<div class="flex items-center gap-3">
					<div class="relative flex w-full items-center justify-end sm:w-auto">
						<div class="overflow-hidden">
							{#if state.showSearch}
								<input
									bind:this={state.searchEl}
									bind:value={state.searchTerm}
									transition:fly={{ x: 120, duration: 250 }}
									placeholder="Search status..."
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
					<Button onclick={downloadExcel}>Export</Button>
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
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									No
								</th>

								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Barcode
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Item ID
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Scan By
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Created At
								</th>
								<th
									class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>
									Status
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
										{row.barcode_id}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.item_id}
									</td>

									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.created_by}
									</td>

									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.created_at}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{#if row.status == 'SUDAH SCAN'}
											<span
												class="rounded-md border border-green-500 bg-green-500/10 px-2 py-1 text-green-700"
											>
												{row.status}
											</span>
										{:else}
											<span
												class="rounded-md border border-red-500 bg-red-500/10 px-2 py-1 text-red-700"
											>
												{row.status}
											</span>
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
					>{state.selectedSto?.sto_code}</span
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
