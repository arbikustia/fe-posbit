<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import dayjs from 'dayjs';
	import { onMount, onDestroy, tick } from 'svelte';
	import { useTransactionForm } from '../../form.svelte';
	import { browser } from '$app/environment';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { saleService } from '@/services/saleService';
	import { toast } from 'svelte-sonner';
	import { userStore } from '@/stores/userStore';
	import { get } from 'svelte/store';

	let {
		variant = 'default',
		state: pageState = $bindable(),
		handleGetListItemGudang
	}: any = $props();
	let timer: ReturnType<typeof setInterval> | null = null;

	function getCookie(name: string) {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
		return null;
	}

	onMount(() => {
		pageState.username = getCookie('username') || 'superadmin';
		timer = setInterval(() => {
			pageState.currentTime = dayjs().format('DD-MM-YYYY HH:mm:ss');
		}, 1000);
	});
	onDestroy(() => timer && clearInterval(timer));

	const paymentOptions = [
		{ value: 'CASH', label: 'CASH' },
		{ value: 'DEBIT', label: 'DEBIT' }
	];

	function formatCurrency(num: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(num || 0);
	}
	function wrapReceiptName(name: unknown, width: number) {
		const words = String(name ?? '-')
			.trim()
			.split(/\s+/);
		const lines: string[] = [];
		let line = '';

		for (const word of words) {
			if (!line || line.length + word.length + 1 <= width) {
				line += `${line ? ' ' : ''}${word}`;
				continue;
			}
			lines.push(line);
			line = word;
		}

		if (line) lines.push(line);
		return lines.flatMap((value) => value.match(new RegExp(`.{1,${width}}`, 'g')) ?? ['-']);
	}

	// 🔹 Fungsi Print Nota Thermal
	function printThermalNota() {
		if (!browser) return;

		// === DATA NOTA ===
		const tanggal = pageState.currentTime || dayjs().format('DD/MM/YYYY HH:mm');
		const kasir = pageState.username || '';
		const customer = pageState.customerName || '';

		// === GABUNGKAN ITEM YANG SAMA BERDASARKAN BARCODE ===
		const mergedItems = [];
		const itemMap = new Map();

		// Gabungkan item dengan barcode yang sama
		for (const item of pageState.itemTable) {
			const { barcode_id, name, harga_jual, qty = 1 } = item;

			if (itemMap.has(barcode_id)) {
				// Jika sudah ada, tambahkan qty
				const existing = itemMap.get(barcode_id);
				existing.qty += qty;
				existing.total = existing.qty * existing.harga_jual;
			} else {
				// Jika belum ada, tambahkan baru
				itemMap.set(barcode_id, {
					barcode_id,
					name,
					harga_jual,
					qty,
					total: harga_jual * qty
				});
			}
		}

		// Konversi map ke array
		mergedItems.push(...itemMap.values());

		// === FORMAT STRUK DALAM TEKS ===
		let nota = '';
		nota += '         DA.ALUS HIJAB         \n';
		nota += '        Ruko B-15 no 17        \n';
		nota += '\x1B\x21\x01';
		nota += ' Mutiara Gading Timur, Mustikajaya, Bekasi\n';
		nota += '\x1B\x21\x08';
		nota += '--------------------------------\n';
		nota += `Tanggal : ${tanggal}\n`;
		nota += `Kasir   : ${kasir}\n`;
		nota += `Customer: ${customer}\n`;
		nota += '--------------------------------\n';
		nota += 'Item                  Hrg   Qty\n';
		nota += '--------------------------------\n';

		let subtotal = 0;
		let totalItemDiscount = 0;
		for (const item of pageState.itemTable) {
			const { name, harga_jual, qty = 1, discount = 0 } = item;
			const total = Math.max(harga_jual * qty - discount, 0);
			subtotal += total;
			totalItemDiscount += discount;

			// Lebar maksimum kertas thermal (misal 32 karakter total)
			const namaCol = 12; // lebar kolom nama
			const hargaCol = 8;
			const qtyCol = 3;
			const totalCol = 9;

			// Bagi nama per kata, lalu pecah kata panjang agar tidak terpotong.
			const namaPotong = wrapReceiptName(name, namaCol);

			// Baris pertama (nama + angka)
			const namaBaris1 = namaPotong[0].padEnd(namaCol, ' ');
			const hrg = String(harga_jual.toLocaleString('id-ID')).padStart(hargaCol, ' ');
			const qtyStr = String(qty).padStart(qtyCol, ' ');
			nota += `${namaBaris1}       Rp${hrg}${qtyStr}\n`;

			if (discount > 0) {
				const discStr = `(-Rp${discount.toLocaleString('id-ID')})`.padStart(32, ' ');
				nota += `\x1B\x4D\x01${discStr}\n\x1B\x4D\x00`;
			}

			// Jika nama lebih panjang, cetak sisanya di bawah (hanya nama)
			for (let i = 1; i < namaPotong.length; i++) {
				nota += `${namaPotong[i]}\n`;
			}
		}

		nota += '--------------------------------\n';
		const diskonPersen = pageState.discount || 0;
		const diskonNilai = (subtotal * diskonPersen) / 100;
		const totalBayar = subtotal - diskonNilai;

		nota += `Subtotal         :Rp${pageState.totalAll?.toLocaleString('id-ID')}\n`;
		nota += `Total Diskon Item:Rp${totalItemDiscount.toLocaleString('id-ID')}\n`;
		nota += `Diskon           :${pageState.discount || 0}% (Rp${diskonNilai})\n`;
		nota += `Total Bayar      :Rp${pageState.grandTotal?.toLocaleString('id-ID')}\n`;
		nota += `Bayar       :Rp${pageState.amountPaid?.toLocaleString('id-ID')}\n`;
		nota += `Kembali     :Rp${((pageState.amountPaid || 0) - (pageState.grandTotal || 0))?.toLocaleString('id-ID')}\n`;

		nota += '--------------------------------\n';
		nota += `Payment: ${pageState.paymentMethod}\n`;
		nota += '--------------------------------\n';
		nota += '         DA.ALUS HIJAB         \n';
		nota += '      IG daalushijab.store		 \n';
		nota += '        tiktok : da.alus        \n';
		nota += ' Terima kasih telah berbelanja! \n';
		nota += '*** Barang yang sudah dibeli ***\n';
		nota += '*** tidak dapat dikembalikan ***\n';

		// === CETAK MENGGUNAKAN RAWBT (BLUETOOTH THERMAL) ===
		try {
			const encoded = btoa(unescape(encodeURIComponent(nota)));
			window.location.href = 'rawbt:base64,' + encoded;
		} catch (error) {
			console.error('Error printing nota:', error);
			alert('Gagal mencetak nota. Pastikan aplikasi RawBT terinstall.');
		}
	}

	function getCashierId() {
		const userInfo = get(userStore)?.userInfo as any;
		const cashierId = userInfo?.id;
		if (!cashierId) throw new Error('Logged-in user ID is missing');
		return String(cashierId);
	}

	async function handlePurchase() {
		if (pageState.isPurchasing) return;

		if ((pageState.amountPaid || 0) < (pageState.grandTotal || 0)) {
			toast.error('Amount Received kurang dari Grand Total. Periksa nominal pembayaran.');
			return;
		}

		if (pageState.itemTable.length === 0 || !pageState.customerName || !pageState.customerNumber) {
			toast.error('Pastikan item, customer name, dan nomor customer terisi.');
			return;
		}

		pageState.isPurchasing = true;
		pageState.isLoading = true;

		try {
			getCashierId();
		} catch (error) {
			console.error('Failed to resolve cashier:', error);
			toast.error('Cashier session ID tidak ditemukan. Muat ulang halaman.');
			pageState.isPurchasing = false;
			pageState.isLoading = false;
			return;
		}

		console.log('Data Transaksi:', {
			...pageState,
			time: pageState.currentTime
		});

		try {
			printThermalNota();
			const res: any = await saleService.create({
				customer_id: pageState?.customerData?.id || null,
				customer_name: pageState.customerName || '',
				phone: pageState.customerNumber || '',
				is_member: !!pageState.customerData,
				cashier_id: getCashierId(),
				total_amount: pageState.totalAll || 0,
				discount_amount: pageState.discount || 0,
				final_amount: pageState.grandTotal || 0,
				point_used: 0,
				point_earned: 0,
				payment_method: pageState.paymentMethod || 'CASH',
				amount_receive: pageState.amountPaid || 0,
				chance: (pageState.amountPaid || 0) - (pageState.grandTotal || 0),
				details: pageState.itemTable.map((item: any) => ({
					barcode_id: item.barcode_id,
					item_id: item.item_id,
					qty: item.qty || 1,
					price: item.harga_jual,
					discount: item.discount || 0
				}))
			});

			if (res.data.status) {
				pageState.customerName = '';
				pageState.customerNumber = null;
				pageState.customerData = null;
				pageState.itemTable = [];
				pageState.amountPaid = null;
				pageState.totalAll = 0;
				pageState.grandTotal = 0;
				pageState.discount = 0;
				pageState.searchProduct = '';
				pageState.paymentMethod = 'CASH';
				await handleGetListItemGudang();
				toast.success('Purchase completed and item list updated');
			} else {
				toast.error('Failed to complete purchase');
			}
		} catch (err) {
			toast.error('Failed to complete purchase');
		} finally {
			pageState.isPurchasing = false;
			pageState.isLoading = false;
		}
	}

	// 🔹 Fungsi format ke IDR
	function formatIDR(value: number | string) {
		if (!value) return '';
		const num = Number(String(value).replace(/[^\d]/g, ''));
		return num.toLocaleString('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		});
	}

	// 🔹 Handler input rupiah
	function handleAmountInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const rawValue = target.value.replace(/[^\d]/g, '');
		pageState.amountPaid = Number(rawValue || 0);
		target.value = formatIDR(rawValue);
	}

	let triggerRef = $state<HTMLButtonElement>(null!);
	const itemOptions = $derived(pageState.listItem ?? []);
	let open = $state(false);

	let searchQuery = $state('');
	const LIMIT = 50;
	const filteredItems = $derived.by(() => {
		if (!itemOptions?.length) return [];
		const q = searchQuery?.toLowerCase().trim();

		// belum search → tampilkan 50 pertama
		if (!q) {
			return itemOptions.slice(0, LIMIT);
		}

		return itemOptions
			.filter((item: any) => {
				const label = String(item.label ?? '').toLowerCase();
				const value = String(item.value ?? '').toLowerCase();

				return label.includes(q) || value.includes(q);
			})
			.slice(0, LIMIT); // tetap batasi render
	});

	function toggleItem(itemValue: string) {
		console.log(itemValue, 'item value');
		pageState.searchProduct = itemValue;
		closeAndFocusTrigger();
	}

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => triggerRef?.focus());
	}
</script>

<Select.Root
	type="single"
	bind:value={pageState.paymentMethod}
	bind:open={pageState.paymentMethodeOpen}
>
	<section class="w-full">
		<Card.Root>
			<Card.Content class="flex  w-full flex-col items-start space-y-4">
				<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-fit items-center gap-2 rounded-md p-1 px-4 text-sm font-medium"
						>
							<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
							{pageState.username}
						</div>
					</div>
					<div class="flex w-48 flex-col items-start justify-center gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-full items-center justify-center rounded-md p-1 px-4 text-center text-sm font-medium"
						>
							{pageState.currentTime}
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<Select.Trigger
							class="text-primary bg-primary/10 relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md border-none p-1 px-4 text-sm font-medium shadow-none"
						>
							<span>{paymentOptions.find((p) => p.value === pageState.paymentMethod)?.label}</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each paymentOptions as option (option.value)}
									<Select.Item value={option.value}>{option.label}</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</div>
					<div class="flex w-72 flex-col items-start justify-start gap-1">
						<Popover.Root bind:open>
							<Popover.Trigger bind:ref={triggerRef} class="h-fit w-full">
								{#snippet child({ props })}
									<Button
										variant="outline"
										class="min-h-[2.5rem] w-full justify-between text-left font-normal"
										{...props}
										role="combobox"
									>
										<div class="flex flex-1 flex-wrap gap-1.5">
											<span class="text-muted-foreground">Search item...</span>
										</div>
										<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>

							<Popover.Content class="w-[600px] p-0">
								<div>
									<Input placeholder="Search items..." class="h-9" bind:value={searchQuery} />
									<div>
										{#if filteredItems.length === 0}
											<div class="flex h-20 w-full items-center justify-center text-center">
												No items found.
											</div>
										{/if}
										<div class="max-h-44 overflow-y-auto">
											{#each filteredItems as item (item.value)}
												<Button
													variant="ghost"
													onclick={() => toggleItem(item.value)}
													class="flex w-full items-center justify-between"
												>
													<div class="flex flex-col items-start">
														<span class="text-xs font-medium">{item.label}</span>
														<span class="text-muted-foreground text-xs">{item.value}</span>
													</div>
													<span class="text-muted-foreground text-xs">{item.stock}</span>
												</Button>
											{/each}
										</div>
									</div>
								</div>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>

				<!-- FORM INPUT -->
				<div class="grid w-full grid-cols-5 flex-row items-end justify-center gap-3">
					<div class="flex w-full flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Phone Number</div>
						<div class="w-full rounded-lg border border-gray-300 p-1">
							<Input
								type="tel"
								bind:value={pageState.customerNumber}
								placeholder="Phone Number"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm font-medium shadow-none transition outline-none placeholder:text-xs placeholder:text-gray-400"
							/>
						</div>
					</div>

					<div class="flex flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Customer Name</div>
						<div class="relative w-full rounded-lg border border-gray-300 p-1">
							<Input
								bind:value={pageState.customerName}
								placeholder="Customer Name"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 pr-8 text-sm font-medium shadow-none transition outline-none placeholder:text-xs placeholder:text-gray-400"
							/>
							{#if pageState.isFetchingCustomer}
								<Icon
									icon="eos-icons:loading"
									class="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-gray-400"
									width="18"
									height="18"
								/>
							{/if}
						</div>
					</div>

					<div class="flex flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Amount Received</div>
						<div class="w-full rounded-lg border border-gray-300 p-1">
							<Input
								type="text"
								inputmode="numeric"
								pattern="[0-9]*"
								oninput={handleAmountInput}
								value={formatIDR(pageState.amountPaid)}
								placeholder="Amount Received"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-left text-sm font-medium shadow-none transition outline-none placeholder:text-xs placeholder:text-gray-400"
							/>
						</div>
					</div>

					<div class="flex flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Discount (%)</div>
						<div class="w-full rounded-lg border border-gray-300 p-1">
							<Input
								type="number"
								bind:value={pageState.discount}
								placeholder="Discount (%)"
								class="hover:bg-primary/5 h-10 w-full border-none px-3 py-2 text-sm font-medium shadow-none transition outline-none placeholder:text-xs placeholder:text-gray-400"
							/>
						</div>
					</div>

					<div class="hidden flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Scan Item</div>
						<div class="w-full rounded-lg border border-gray-300 p-1">
							<Input
								bind:value={pageState.searchProduct}
								placeholder="Scan Item"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm font-medium shadow-none transition outline-none"
							/>
						</div>
					</div>

					<Button
						onclick={handlePurchase}
						disabled={pageState.isPurchasing}
						class={cn('h-12 w-full flex-none text-lg', { 'min-h-11': variant === 'default' })}
						size="lg"
					>
						{#if pageState.isPurchasing}
							<Icon icon="eos-icons:loading" class="mr-2 animate-spin" width="18" height="18" />
							<span>Processing...</span>
						{:else}
							<Icon icon="solar:printer-bold" width="20" height="20" class="mr-1" />
							<span class="ml-1">Purchase</span>
						{/if}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</Select.Root>

<style>
	:global {
		input:focus {
			outline: none !important;
			box-shadow: none !important;
		}
	}
</style>
