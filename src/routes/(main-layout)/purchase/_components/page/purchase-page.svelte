<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { usePurchasePage } from '../../create/use-create.svelte';
	import { purchaseService } from '@/services/purchaseService';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import dayjs from 'dayjs';
	import InvoicePage from '../../../report/purchase/_components/invoice-purchase/invoice-page.svelte';
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	const { state, handleGetPaged, handlePageChange } = usePurchasePage();

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

	onMount(async () => {
		await handleGetPaged();
	});

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

	let popoverOpen = false;

	// ✅ Ubah tanggal → update di state & fetch ulang data
	function handleDateChange(v: any) {
		console.log('Date changed:', v);

		// Cek apakah start dan end sudah terisi
		if (v?.start && v?.end) {
			// Update state dengan tanggal baru
			state.startDate = dayjs(v.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD');
			state.endDate = dayjs(v.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD');

			console.log('Fetching data for:', state.startDate, state.endDate);

			// Tutup Popover otomatis setelah end date dipilih
			popoverOpen = false;
		}
	}

	// ✅ Helper untuk tampilkan teks tanggal dengan aman
	function formatDateText() {
		if (!state.startDate || !state.endDate) return 'Pick a date';
		return (
			df.format(dayjs(state.startDate).toDate()) + ' - ' + df.format(dayjs(state.endDate).toDate())
		);
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

				<div class="flex gap-2">
					<!-- Search -->
					<div class="relative flex w-full items-center justify-end sm:w-auto">
						<div class="overflow-hidden">
							{#if state.showSearch}
								<input
									bind:this={state.searchEl}
									bind:value={state.searchTerm}
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
					<Select.Root
						type="single"
						bind:value={state.statusPo}
						onValueChange={() => handleGetPaged(1)}
					>
						<Select.Trigger class="w-full text-sm">
							{'Status PO'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">All</Select.Item>
							<Select.Item value="OPEN">OPEN</Select.Item>
							<Select.Item value="CLOSE">CLOSE</Select.Item>
						</Select.Content>
					</Select.Root>
					<Select.Root
						type="single"
						bind:value={state.paymentStatus}
						onValueChange={() => handleGetPaged(1)}
					>
						<Select.Trigger class="w-full text-sm">
							{'Payment Status'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">All</Select.Item>
							<Select.Item value="DP">DP</Select.Item>
							<Select.Item value="LUNAS">LUNAS</Select.Item>
							<Select.Item value="CANCEL">CANCEL</Select.Item>
						</Select.Content>
					</Select.Root>
					<!-- FILTER DATE -->
					<div class="flex gap-2">
						<Popover.Root bind:open={popoverOpen}>
							<Popover.Trigger
								class={cn(buttonVariants({ variant: 'outline' }), 'flex items-center')}
							>
								<CalendarIcon class="mr-2 size-4" />
								{formatDateText()}
							</Popover.Trigger>

							<Popover.Content class="w-auto p-0" align="start">
								<RangeCalendar
									numberOfMonths={2}
									onValueChange={handleDateChange}
									value={{
										start: new CalendarDate(
											Number(dayjs(state.startDate).format('YYYY')),
											Number(dayjs(state.startDate).format('M')),
											Number(dayjs(state.startDate).format('D'))
										),
										end: new CalendarDate(
											Number(dayjs(state.endDate).format('YYYY')),
											Number(dayjs(state.endDate).format('M')),
											Number(dayjs(state.endDate).format('D'))
										)
									}}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
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
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Package Name</th
								>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Customer</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Payment Status</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Status Po</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Down Payment</th
								>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Total</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Label</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Ongkir</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Payment</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Created By</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700">Created At</th>
								<th class="px-3 py-2.5 text-left text-xs font-medium text-gray-700"
									>Order Details</th
								>
								<th class="px-3 py-2.5 text-center text-xs font-medium text-gray-700"
									>Description</th
								>
								<th class="px-3 py-2.5 text-center text-xs font-medium text-gray-700">Action</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-gray-100">
							{#each state.table as row}
								<tr class="hover:bg-gray-50">
									<td class="px-3 py-2.5 text-xs text-gray-500">{row.no}</td>
									<td class="px-3 py-2.5 text-xs"><InvoicePage {row} /></td>
									<td class="px-3 py-2.5 text-xs text-gray-500">{row.package_name}</td>
									<td class="px-3 py-2.5 text-xs">
										{#if row.person_id}
											<Popover.Root>
												<Popover.Trigger
													class="cursor-pointer text-start text-xs font-medium text-blue-500 underline hover:text-blue-600"
												>
													{row.customer_name}
												</Popover.Trigger>

												<Popover.Content
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
												</Popover.Content>
											</Popover.Root>
										{:else}
											<span class="text-xs text-gray-400 italic">No customer</span>
										{/if}
									</td>

									<td class="px-3 py-2.5 text-xs">{row.payment_status}</td>
									<td class="px-3 py-2.5 text-xs">{row.status_po}</td>
									<td class="px-3 py-2.5 text-xs">Rp {row.down_payment.toLocaleString() || '-'}</td>
									<td class="px-3 py-2.5 text-xs">Rp {row.total_amount.toLocaleString()}</td>
									<td class="px-3 py-2.5 text-xs">Rp {row.label?.toLocaleString() || '0'}</td>
									<td class="px-3 py-2.5 text-xs">Rp {row.ongkir?.toLocaleString() || '0'}</td>
									<td class="px-3 py-2.5 text-xs">{row.payment_method}</td>
									<td class="px-3 py-2.5 text-xs">{row.created_by}</td>
									<td class="px-3 py-2.5 text-xs">{row.created_at}</td>

									<!-- Order Details Popover -->
									<td class="px-3 py-2.5 text-xs">
										{#if row.purchase_order_details?.length > 0}
											<Popover.Root>
												<Popover.Trigger
													class="cursor-pointer text-xs font-medium text-blue-500 underline hover:text-blue-600"
												>
													See more
												</Popover.Trigger>

												<Popover.Content
													class="max-h-60 w-[500px] overflow-y-auto rounded-lg bg-white p-3 shadow-lg"
												>
													<p class="mb-2 text-sm font-semibold text-gray-700">Order Details</p>
													<table class="min-w-full text-xs">
														<thead>
															<tr class="border-b border-gray-200 text-gray-500">
																<th class="py-1 text-left">Item ID</th>
																<th class="py-1 text-left">Name</th>
																<th class="py-1 text-left">Price</th>
																<th class="py-1 text-left">Desc</th>
																<th class="py-1 text-left">Qty</th>
																<th class="py-1 text-left">Qty Keluar</th>
															</tr>
														</thead>
														<tbody>
															{#each row.purchase_order_details as detail}
																<tr>
																	<td class="py-1 text-gray-700">{detail.item_id}</td>
																	<td class="py-1 text-gray-700">{detail.name}</td>
																	<td class="py-1 text-gray-700"
																		>Rp{detail.price.toLocaleString()}</td
																	>
																	<td class="py-1 text-gray-700">{detail.description}</td>
																	<td class="py-1 text-gray-700">{detail.qty}</td>
																	<td class="py-1 text-center text-gray-700">{detail.qty_keluar || 0}</td
																	>
																</tr>
															{/each}
														</tbody>
													</table>
												</Popover.Content>
											</Popover.Root>
										{:else}
											<span class="text-xs text-gray-400 italic">No details</span>
										{/if}
									</td>

									<td class="px-3 py-2.5 text-xs">{row.keterangan}</td>
									<!-- Actions -->
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
													onclick={() => {
														const details =
															row.purchase_order_details?.map((d: any) => ({
																item_id: d.item_id,
																name: d.name,
																qty: d.qty,
																qty_keluar: d.qty_keluar,
																price: 0,
																priceKey: row.package_name || 'Harga Normal'
															})) || [];
														console.log('🔍 keterangan before append:', row.keterangan);

														const params = new URLSearchParams();
														params.append('id', String(row.id || ''));
														params.append('customer_id', String(row.person_id || ''));
														params.append('status', row.status || 'DP');
														params.append('payment_method', row.payment_method || 'CASH');
														params.append('package_id', row.package_id || '');
														params.append('total', String(row.total_amount || 0));
														params.append('final', String(row.final_amount || 0));
														params.append('discount', String(row.discount_amount || 0));
														params.append('down_payment', String(row.down_payment || 0));
														params.append('label', String(row.label || 0)); // <-- tambahkan ini
														params.append('ongkir', String(row.ongkir || 0)); // <-- tambahkan ini
														params.append('keterangan', row.keterangan || '');
														params.append('details', JSON.stringify(details));
														params.append('inv_number', row.inv_number);

														goto(`/purchase/create?${params.toString()}`);
													}}
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

<!-- DELETE CONFIRM MODAL -->
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
