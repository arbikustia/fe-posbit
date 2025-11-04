<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { useSalesPage } from '../../create/use-create.svelte';
	import { browser } from '$app/environment';

	const { state, handlePageChange, handleSearch, toggleRow } = useSalesPage();

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;
	let searchTerm = '';

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		} else {
			searchTerm = '';
			handleSearch('');
		}
	}

	function onSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchTerm = target.value;
		handleSearch(searchTerm);
	}

	let showDeleteModal = false;
	let selectedSale: any | null = null;

	function openDeleteModal(row: any) {
		selectedSale = row;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedSale = null;
	}

	function confirmDelete() {
		if (selectedSale) {
			// TODO: Call delete API here
			closeDeleteModal();
		}
	}

	// Format currency
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	// Format date
	function formatDate(dateString: string) {
		if (!dateString || dateString === '-') return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	// Fungsi print nota thermal untuk report
	function printReportNota(sale: any) {
		if (!browser) return;

		// === DATA NOTA ===
		const toko = 'DA.ALUS HIJAB';
		const alamat1 = 'Ruko B-15 no 17, Mutiara';
		const alamat2 = 'Gading Timur, Mustikajaya, Bekasi';
		const tanggal = formatDate(sale.created_at) || dayjs().format('DD/MM/YYYY HH:mm');
		const kasir = sale.cashier || '';
		const customer = sale.customer_name || '';
		const transactionCode = sale.transaction_code || '';

		// Helper untuk teks center
		const center = (text: string) => {
			const width = 32;
			const space = Math.max(0, Math.floor((width - text.length) / 2));
			return ' '.repeat(space) + text + '\n';
		};

		let nota = '';

		// === HEADER TOKO ===
		nota += '\x1B\x21\x30'; // Double width + height
		nota += center(toko.toUpperCase());
		nota += '\x1B\x21\x00'; // Kembali ke ukuran normal
		nota += center(alamat1);
		nota += '\x1B\x21\x01'; // Font lebih kecil (condensed)
		nota += center(alamat2);
		nota += '\x1B\x21\x00'; // Normal lagi

		nota += '--------------------------------\n';
		nota += `Tanggal : ${tanggal}\n`;
		nota += `Kasir   : ${kasir}\n`;
		nota += `Customer: ${customer}\n`;
		nota += `No. Trans: ${transactionCode}\n`;
		nota += '--------------------------------\n';
		nota += 'Item                  Hrg   Qty\n';
		nota += '--------------------------------\n';

		let subtotal = 0;

		// Gunakan details dari data sale
		if (sale.details && sale.details.length > 0) {
			for (const item of sale.details) {
				const { item_name, price, qty = 1 } = item;
				const total = price * qty;
				subtotal += total;

				const namaCol = 12;
				const hargaCol = 8;
				const qtyCol = 3;

				const namaPotong = [];
				let sisa = String(item_name);

				while (sisa.length > 0) {
					namaPotong.push(sisa.substring(0, namaCol));
					sisa = sisa.substring(namaCol);
				}

				const namaBaris1 = namaPotong[0].padEnd(namaCol, ' ');
				const hrg = String(price.toLocaleString('id-ID')).padStart(hargaCol, ' ');
				const qtyStr = String(qty).padStart(qtyCol, ' ');
				nota += `${namaBaris1}   Rp${hrg}${qtyStr}\n`;

				for (let i = 1; i < namaPotong.length; i++) {
					nota += `${namaPotong[i]}\n`;
				}
			}
		}

		nota += '--------------------------------\n';

		// Hitung diskon berdasarkan data sale
		const diskonNilai = sale.discount_amount || 0;
		const diskonPersen = sale.total_amount > 0 ? (diskonNilai / sale.total_amount) * 100 : 0;

		nota += `Subtotal    : Rp${(sale.total_amount || 0)?.toLocaleString('id-ID')}\n`;
		nota += `Diskon      : ${diskonPersen.toFixed(1)}% (Rp${diskonNilai?.toLocaleString('id-ID')})\n`;
		nota += `Total       : Rp${(sale.final_amount || 0)?.toLocaleString('id-ID')}\n`;

		// Tambahkan informasi pembayaran jika ada
		if (sale.amount_receive) {
			nota += `Nominal     : Rp${(sale.amount_receive || 0)?.toLocaleString('id-ID')}\n`;
			nota += `Kembalian   : Rp${(sale.change || 0)?.toLocaleString('id-ID')}\n`;
		}

		nota += '--------------------------------\n';
		nota += `Payment: ${sale.payment_method || 'CASH'}\n`;
		nota += '--------------------------------\n';

		// === FOOTER ===
		nota += center('DA.ALUS HIJAB');
		nota += center('IG: daalushijab.store');
		nota += center('TIKTOK: da.alus');
		nota += center('Terima kasih telah berbelanja!');
		nota += center('*** Barang yang sudah dibeli ***');
		nota += center('*** tidak dapat dikembalikan ***');

		try {
			const encoded = btoa(unescape(encodeURIComponent(nota)));
			window.location.href = 'rawbt:base64,' + encoded;
		} catch (error) {
			console.error('Error printing nota:', error);
			alert('Gagal mencetak nota. Pastikan aplikasi RawBT terinstall.');
		}
	}

	// Fungsi untuk handle klik transaction code
	function handlePrintNota(row: any) {
		// Pastikan data details tersedia sebelum print
		if (!row.details || row.details.length === 0) {
			// Jika details belum ada, buka row terlebih dahulu untuk memuat details
			if (!row.open) {
				toggleRow(row.id);
				// Tunggu sebentar agar details terload, lalu print
				setTimeout(() => {
					const updatedRow = state.table.find((r) => r.id === row.id);
					if (updatedRow && updatedRow.details && updatedRow.details.length > 0) {
						printReportNota(updatedRow);
					} else {
						alert('Tidak dapat memuat detail transaksi untuk dicetak');
					}
				}, 500);
			} else {
				printReportNota(row);
			}
		} else {
			printReportNota(row);
		}
	}
</script>

<!-- HEADER -->
<header class="mb-4 sm:mb-6 md:mb-8">
	<div class="flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
		<Button
			variant="ghost"
			class="flex w-28 cursor-default items-center justify-center gap-2 rounded-full bg-transparent px-0 py-2 text-xs hover:bg-transparent sm:w-auto md:w-fit md:text-sm"
		>
			<div class="flex items-center justify-between">
				<h1 class="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-2xl">
					Report Sale
				</h1>
			</div>
		</Button>

		<!-- Search Container -->
		<div class="relative flex w-full items-center justify-end sm:w-auto">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						bind:this={searchEl}
						bind:value={searchTerm}
						oninput={onSearchInput}
						transition:fly={{ x: 120, duration: 250 }}
						placeholder="Search transaction..."
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

<!-- LOADING STATE -->
{#if state.isLoading}
	<div class="flex items-center justify-center py-12">
		<div class="flex flex-col items-center gap-3">
			<Icon icon="eos-icons:loading" width="40" height="40" class="text-primary" />
			<p class="text-sm text-gray-500">Loading sales data...</p>
		</div>
	</div>
{:else}
	<!-- TABLE -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<div class="inline-block min-w-full align-middle">
			<div class="overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-100">
						<tr>
							<th
								class="w-8 px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3"
							></th>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>No</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Transaction Code</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Customer</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Cashier</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Total Amount</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Discount</th
							>
							<th
								class="px-3 py-2.5 text-right text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Final Amount</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Payment</th
							>
							<th
								class="px-3 py-2.5 text-left text-xs font-medium text-gray-700 sm:px-4 sm:py-3 md:text-sm"
								>Date</th
							>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-200 bg-white">
						{#if state.table.length === 0}
							<tr>
								<td colspan="10" class="px-4 py-8 text-center text-sm text-gray-500">
									No sales data found
								</td>
							</tr>
						{:else}
							{#each state.table as row, index}
								<tr class="transition hover:bg-gray-50">
									<!-- Expand button -->
									<td class="px-3 py-2.5 sm:px-4 sm:py-3">
										<button
											type="button"
											onclick={() => toggleRow(row.id)}
											class="rounded p-1 transition hover:bg-gray-200"
										>
											<Icon
												icon={row.open ? 'mdi:chevron-down' : 'mdi:chevron-right'}
												width="20"
												height="20"
												class="text-gray-600"
											/>
										</button>
									</td>

									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.no}
									</td>
									<td
										onclick={() => handlePrintNota(row)}
										class="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.transaction_code}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.customer_name}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{row.cashier}
									</td>
									<td
										class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{formatCurrency(row.total_amount)}
									</td>
									<td
										class="px-3 py-2.5 text-right text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{formatCurrency(row.discount_amount)}
									</td>
									<td
										class="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										{formatCurrency(row.final_amount)}
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-900 sm:px-4 sm:py-3 md:text-sm"
									>
										<span
											class={cn(
												'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
												row.payment_method === 'CASH'
													? 'bg-green-100 text-green-700'
													: 'bg-blue-100 text-blue-700'
											)}
										>
											{row.payment_method}
										</span>
									</td>
									<td
										class="px-3 py-2.5 text-xs whitespace-nowrap text-gray-500 sm:px-4 sm:py-3 md:text-sm"
									>
										{formatDate(row.created_at)}
									</td>
								</tr>

								<!-- Details Row (Expandable) -->
								{#if row.open === true && row.details && row.details.length > 0}
									<tr class="bg-gray-50">
										<td colspan="10" class="px-3 py-4 sm:px-4">
											<div class="space-y-3">
												<div class="flex items-center justify-between">
													<h4 class="text-sm font-semibold text-gray-700">Transaction Details</h4>
													<div class="flex gap-4 text-xs text-gray-600">
														<span
															>Amount Received: <strong class="text-gray-900"
																>{formatCurrency(row.amount_receive)}</strong
															></span
														>
														<span
															>Change: <strong class="text-gray-900"
																>{formatCurrency(row.change)}</strong
															></span
														>
													</div>
												</div>

												<div class="overflow-x-auto">
													<table class="min-w-full text-sm">
														<thead class="bg-gray-100">
															<tr>
																<th class="px-3 py-2 text-left text-xs font-medium text-gray-600"
																	>Item</th
																>
																<th class="px-3 py-2 text-center text-xs font-medium text-gray-600"
																	>Qty</th
																>
																<th class="px-3 py-2 text-right text-xs font-medium text-gray-600"
																	>Price</th
																>
																<th class="px-3 py-2 text-right text-xs font-medium text-gray-600"
																	>Subtotal</th
																>
															</tr>
														</thead>
														<tbody class="divide-y divide-gray-200">
															{#each row.details as detail}
																<tr>
																	<td class="px-3 py-2 text-gray-900">{detail.item_name}</td>
																	<td class="px-3 py-2 text-center text-gray-900">{detail.qty}</td>
																	<td class="px-3 py-2 text-right text-gray-900"
																		>{formatCurrency(detail.price)}</td
																	>
																	<td class="px-3 py-2 text-right font-medium text-gray-900"
																		>{formatCurrency(detail.subtotal)}</td
																	>
																</tr>
															{/each}
														</tbody>
													</table>
												</div>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- PAGINATION -->
	<div class="w-full">
		<Pagination.Root count={state.totalCount} perPage={state.pageSize} page={state.currentPage}>
			{#snippet children({ pages, currentPage })}
				<div class="mt-4 flex w-full items-center justify-between">
					<p class="text-sm text-gray-600">
						Showing <strong>{(state.currentPage - 1) * state.pageSize + 1}</strong> to
						<strong>{Math.min(state.currentPage * state.pageSize, state.totalCount)}</strong> of
						<strong>{state.totalCount}</strong> results
					</p>

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
{/if}

<!-- 🧩 DELETE CONFIRM MODAL -->
{#if showDeleteModal}
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
				Are you sure you want to delete transaction
				<span class="font-semibold text-gray-800 dark:text-gray-100"
					>{selectedSale?.transaction_code}</span
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
