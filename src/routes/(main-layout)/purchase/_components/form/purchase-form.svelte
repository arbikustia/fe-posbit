<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount, tick } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { usePurchasePage } from '../../create/use-create.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { customerService } from '@/services/customerService';
	import { purchaseService } from '@/services/purchaseService';
	import { toast } from 'svelte-sonner';

	const { form, handleSubmit, state: pageState } = usePurchasePage();
	const { form: formData, enhance, errors } = form;

	// === OPTIONS ===
	const itemOptions = $derived(pageState.listItem ?? []);

	let customerOptions: { value: string; label: string }[] = $state([]);
	let packageOptions: { value: string; label: string }[] = $state([]);
	let lblOptions: { value: string; label: string; price: number }[] = $state([]);
	let selectedLabels = $state<{ label_id: string; qty: number }[]>([]);

	// === STATES ===
	let selectedItems = $state<string[]>([]);

	let itemDetails = $state<
		{
			item_id: string;
			qty: number;
			price: number;
			discount: number;
			priceKey: string;
			name: string;
		}[]
	>([]);

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let customerOpen = $state(false);
	let customerTriggerRef = $state<HTMLButtonElement>(null!);

	// Derived labels
	const customerLabel = $derived(
		customerOptions.find((r) => r.value === $formData.customer_id)?.label ?? 'Select Customer'
	);

	const packageLabel = $derived(
		packageOptions.find((r) => r.value === $formData.package_id)?.label ?? 'Select package'
	);
	const lblDataLabel = $derived(
		selectedLabels.length === 0 ? 'Select labels...' : `${selectedLabels.length} label(s) selected`
	);

	let labelOpen = $state(false);

	function toggleLabel(labelId: string, price: number) {
		const existingLabel = selectedLabels.find((l) => l.label_id === labelId);

		if (existingLabel) {
			selectedLabels = selectedLabels.filter((l) => l.label_id !== labelId);
		} else {
			selectedLabels = [...selectedLabels, { label_id: labelId, qty: 1, price: price }];
		}
		updateFormLabels();
	}

	function removeLabel(labelId: string, e: Event) {
		e.stopPropagation();
		selectedLabels = selectedLabels.filter((l) => l.label_id !== labelId);
		updateFormLabels();
	}

	function updateLabelQty(labelId: string, newQty: number) {
		if (newQty >= 1) {
			selectedLabels = selectedLabels.map((l) =>
				l.label_id === labelId ? { ...l, qty: newQty } : l
			);
			updateFormLabels();
		}
	}

	function updateFormLabels() {
		formData.update((f) => ({
			...f,
			labels: selectedLabels
		}));
	}

	function clearAllLabels(e: Event) {
		e.stopPropagation();
		selectedLabels = [];
		updateFormLabels();
	}

	const isShopeePackage = $derived(packageLabel.toLowerCase() === 'shopee');

	const paymentStatusOptions = [
		{ value: 'LUNAS', label: 'Lunas' },
		{ value: 'DP', label: 'DP' },
		{ value: 'CANCEL', label: 'Cancelled' }
	];
	const statusPoOptions = [
		{ value: 'OPEN', label: 'Open' },
		{ value: 'CLOSE', label: 'Close' }
	];

	const paymentOptions = [
		{ value: 'CASH', label: 'Cash' },
		{ value: 'DEBIT', label: 'Debit' }
	];
	const paymentStatusLabel = $derived(
		paymentStatusOptions.find((r) => r.value === $formData.payment_status)?.label ??
			'Select Payment Status'
	);
	const statusPoLabel = $derived(
		statusPoOptions.find((r) => r.value === $formData.status_po)?.label ?? 'Select Status Po'
	);
	const paymentLabel = $derived(
		paymentOptions.find((r) => r.value === $formData.payment_method)?.label ??
			'Select Payment Method'
	);

	// === GET PRICE BY PACKAGE ===
	function getItemPriceByPackage(item: any, packageName: string) {
		if (!item) return 0;

		// Jika package adalah shopee, harga selalu 0
		if (packageName.toLowerCase() === 'shopee') {
			return 0;
		}

		switch (packageName) {
			case 'Harga Normal':
				return item.harga;
			case 'Harga A':
				return item.harga_a;
			case 'Harga B':
				return item.harga_b;
			case 'Harga C':
				return item.harga_c;
			case 'Harga D':
				return item.harga_d;
			case 'Harga E':
				return item.harga_e;
			case 'Harga F':
				return item.harga_f;
			case 'shopee':
				return 0;
			default:
				return item.harga;
		}
	}

	// === TOGGLE ITEMS ===
	function toggleItem(itemValue: string, label: string) {
		const oldCount = selectedItems.length;

		if (selectedItems.includes(itemValue)) {
			selectedItems = selectedItems.filter((id) => id !== itemValue);
		} else {
			selectedItems = [...selectedItems, itemValue];
		}
		syncSelectedItems();

		// Log perubahan item count
		const newCount = selectedItems.length;
		if (newCount > oldCount) {
			pageState.poLogIncreaseItem.push({
				action: label,
				aktivitas: `Increase item from ${oldCount} to ${newCount}`,
				inv_number: $formData.inv_number
			});
		} else {
			pageState.poLogDecreaseItem.push({
				action: label,
				aktivitas: `Decrease item from ${oldCount} to ${newCount}`,
				inv_number: $formData.inv_number
			});
		}
	}

	$effect(() => {
		console.log('Selected Formdata100:', $formData);
		console.log('page state', pageState?.detailFromParams ?? 0);
	});

	function removeItem(itemValue: string, e: Event, label: string) {
		console.log('remove', itemValue, e, label);
		e.stopPropagation();

		const oldCount = selectedItems.length;

		selectedItems = selectedItems.filter((id) => id !== itemValue);
		syncSelectedItems();

		// Log perubahan item count
		const newCount = selectedItems.length;
		pageState.poLogDecreaseItem.push({
			action: label,
			aktivitas: `Decrease item from ${oldCount} to ${newCount}`,
			inv_number: $formData.inv_number
		});
	}
	function clearAll(e: Event) {
		e.stopPropagation();
		const oldCount = selectedItems.length;

		selectedItems = [];
		itemDetails = []; // Reset itemDetails juga
		syncSelectedItems();

		pageState.poLogDecreaseItem.push({
			action: 'All',
			aktivitas: `Decrease item from ${oldCount} to 0`,
			inv_number: $formData.inv_number
		});
	}

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => triggerRef?.focus());
	}

	// === CUSTOMER SELECTION ===
	function selectCustomer(customerId: string) {
		console.log(customerId, 'ok');
		purchaseService.getPurchaseOrder(Number(customerId)).then((res: any) => {
			console.log(res.data.data, 'test');
			if (res.data.status) {
				if (res?.data.data?.status_po == 'OPEN') {
					pageState.isStatusOpen = true;
					toast.error('This customer has an open status.');
				} else {
					pageState.isStatusOpen = false;
				}
			} else {
				toast.error('Something went wrong');
			}
		});
		formData.update((f) => ({ ...f, customer_id: customerId }));
		customerOpen = false;
		tick().then(() => customerTriggerRef?.focus());
	}

	// === SYNC SELECTED ITEMS WITH DETAILS ===
	function syncSelectedItems() {
		const mapped = selectedItems.map((id) => {
			const existing = itemDetails.find((d) => d.item_id === id);
			const item = pageState.listItem.find((i) => i.value === id);
			const qty = existing?.qty ?? 1;

			// PERBAIKAN: Prioritaskan existing price saat edit
			let price;
			let priceKey;

			if (existing && existing.price !== undefined && existing.price !== null) {
				// Gunakan existing price jika ada (untuk edit mode)
				price = existing.price;
				priceKey = existing.priceKey;
			} else {
				// Calculate baru untuk item baru
				price = getItemPriceByPackage(item, packageLabel);
				priceKey = packageLabel;
			}

			const name = existing?.name ?? '';
			const discount = existing?.discount ?? 0;
			return { item_id: id, qty, price, discount, priceKey, name };
		});

		itemDetails = mapped;
		formData.update((f) => ({ ...f, details: mapped }));
	}

	// === UPDATE QUANTITY ===
	function updateQty(id: string, newQty: number, oldQty: number, name: string, qty_keluar: number) {
		const item = pageState.listItem.find((i) => i.value === id);
		console.log(qty_keluar ?? 0, 'qty_keluar for item:', id);
		if (!item) return;

		// Hanya batasi minimal (tidak boleh kurang dari qty_keluar), tidak ada batas maksimal
		const minQty = Math.max(1, qty_keluar ?? 0); // Minimal tidak boleh kurang dari qty_keluar atau 1

		// Tidak ada batasan maksimal, jadi qty bisa lebih dari stock
		const qty = Math.max(minQty, newQty);

		const detail = itemDetails.find((d) => d.item_id === id);
		const price = detail?.price || getItemPriceByPackage(item, packageLabel);
		const priceKey = detail?.priceKey || packageLabel;

		const updated = itemDetails.map((i) =>
			i.item_id === id
				? { ...i, qty, price, priceKey, qty_keluar: qty_keluar ?? 0, discount: i.discount }
				: i
		);
		itemDetails = updated;
		formData.update((f) => ({ ...f, details: updated }));

		// Log perubahan quantity
		if (qty > oldQty) {
			pageState.poLogIncreaseQty.push({
				action: name,
				aktivitas: `Increase qty from ${oldQty} to ${qty}`,
				inv_number: $formData.inv_number
			});
		} else if (qty < oldQty) {
			pageState.poLogDecreaseQty.push({
				action: name,
				aktivitas: `Decrease qty from ${oldQty} to ${qty}`,
				inv_number: $formData.inv_number
			});
		}
	}

	// === WATCH PACKAGE CHANGES ===
	let previousPackageId = $state<string | undefined>(undefined);

	// Effect untuk update harga ketika package berubah
	// Effect untuk update harga ketika package berubah
	$effect(() => {
		if (
			$formData.package_id &&
			$formData.package_id !== previousPackageId &&
			selectedItems.length > 0
		) {
			// PERBAIKAN: Hanya update harga jika bukan edit mode atau user memang ganti package
			// Cek apakah ini perubahan package pertama kali (edit mode load) atau user action
			const isInitialLoad = previousPackageId === undefined && pageState.isEditing;

			if (!isInitialLoad) {
				// Update harga semua item berdasarkan package baru
				itemDetails = itemDetails.map((detail) => {
					const item = pageState.listItem.find((i) => i.value === detail.item_id);
					const newPrice = getItemPriceByPackage(item, packageLabel);
					return {
						...detail,
						price: newPrice,
						priceKey: packageLabel
					};
				});

				formData.update((f) => ({ ...f, details: itemDetails }));
			}

			previousPackageId = $formData.package_id;
		}
	});

	$effect(() => {
		// Sync ketika formData.details berubah (untuk edit mode)
		if ($formData.details && $formData.details.length > 0 && selectedItems.length === 0) {
			console.log('Syncing form data to UI:', $formData.details);

			selectedItems = $formData.details.map((d: any) => d.item_id);

			itemDetails = $formData.details.map((d: any) => {
				const item = pageState.listItem.find((i: any) => i.value === d.item_id);

				// PERBAIKAN: Gunakan price dari data yang ada, jangan recalculate
				return {
					item_id: d.item_id,
					qty: d.qty || 1,
					qty_keluar: d.qty_keluar || 0,
					qty_delivery: d.qty_delivery || 0,
					price: d.price, // Langsung gunakan price dari data
					priceKey: d.priceKey || packageLabel,
					name: d.name || item?.label || ''
				};
			});

			// Update detailFromParams untuk tracking perubahan quantity
			if (pageState.detailFromParams.length === 0) {
				pageState.detailFromParams = [...itemDetails];
			}
		}

		// Sync labels
		if ($formData.labels && $formData.labels.length > 0 && selectedLabels.length === 0) {
			console.log('Syncing labels from form data:', $formData.labels);
			selectedLabels = $formData.labels.map((label: any) => ({
				label_id: label.label_id || label.id,
				qty: label.qty || 1,
				price: label.price || 0
			}));
		}
	});

	// === AUTO CALCULATE TOTAL ===
	// $effect(() => {
	// 	let total = 0;

	// 	if (isShopeePackage) {
	// 		const storedData = sessionStorage.getItem('editing_purchase');
	// 		if (!storedData) {
	// 			console.warn('No purchase data found in session storage');
	// 			return;
	// 		}

	// 		const purchaseData = JSON.parse(storedData);
	// 		// Untuk package shopee, gunakan manual total_amount
	// 		total = purchaseData.total_amount;
	// 	} else {
	// 		// Untuk package lainnya, hitung otomatis
	// 		total = 0;
	// 		console.warn(total, 'total calculated');
	// 	}

	// 	formData.update((f) => ({
	// 		...f,
	// 		total_amount: total,
	// 		final_amount: total - (f.biaya_label ?? 0)
	// 	}));
	// 	// sessionStorage.removeItem('editing_purchase');
	// });

	// === INITIALIZE FORM DATA ON MOUNT ===
	// === INITIALIZE FORM DATA ON MOUNT ===
	onMount(async () => {
		// --- DECODE KETERANGAN DARI URL/QUERY (jika ada) ---
		const qp = new URLSearchParams(window.location.search);
		const rawKeterangan = qp.get('keterangan') ?? '';
		if (rawKeterangan) {
			const decodedKeterangan = decodeURIComponent(decodeURIComponent(rawKeterangan));
			console.warn(decodedKeterangan, 'decodedKeterangan');
			formData.update((f) => ({ ...f, keterangan: decodedKeterangan }));
		}
		const rawLabels = qp.get('labels') ?? '';
		if (rawLabels) {
			const decodedLabels = decodeURIComponent(decodeURIComponent(rawLabels));
			console.warn(JSON.parse(decodedLabels), 'decodedLabels');
			formData.update((f) => ({ ...f, labels: JSON.parse(decodedLabels) }));
		}

		// Load labels
		try {
			const labelRes: any = await purchaseService.getDataLabel(); // Sesuaikan dengan service Anda
			lblOptions = labelRes.data.data.map((item: { id: string; name: string; price: number }) => ({
				value: item.id,
				label: item.name,
				price: item.price
			}));

			// Restore labels dari formData (untuk edit mode)
			// Cek apakah menggunakan key 'label' atau 'labels'
			console.warn($formData.labels, 'okokoko');
			const labelsData = $formData.labels || $formData.labels;
			if (labelsData && labelsData.length > 0) {
				// MENJADI INI:
				selectedLabels = labelsData.map((label: any) => ({
					label_id: label.label_id,
					qty: label.qty || 1,
					price: label.price || 0
				}));
			}
		} catch (err) {
			console.error('Failed to load labels:', err);
		}

		// Load customers
		try {
			const customerRes: any = await customerService.getDataPerson();
			customerOptions = customerRes.data.data.map((customer: any, index: number) => ({
				value: String(customer.id ?? `customer-${index}`),
				label: customer.firstname + ' ' + customer.lastname
			}));
		} catch (err) {
			console.error('Failed to load customers:', err);
		}

		// Load packages
		try {
			const packageRes: any = await purchaseService.getDataPackage();
			packageOptions = packageRes.data.data.map(
				(item: { id: string; package_name: string }, index: number) => ({
					value: item.id,
					label: item.package_name
				})
			);
		} catch (err) {
			console.error('Failed to load packages:', err);
		}

		// Tunggu sampai list item sudah terisi
		const waitForItems = async () => {
			let retries = 0;
			while (pageState.listItem.length === 0 && retries < 20) {
				await new Promise((r) => setTimeout(r, 100));
				retries++;
			}
		};
		await waitForItems();
		await tick();
		// HANYA inisialisasi jika belum ada selectedItems (kasus create baru)
		if (selectedItems.length === 0) {
			// Restore items dari formData.details (untuk edit mode)
			// Restore items dari formData.details (untuk edit mode)
			if ($formData.details && $formData.details.length > 0) {
				selectedItems = $formData.details.map((d: any) => d.item_id);

				itemDetails = $formData.details.map((d: any) => {
					const item = pageState.listItem.find((i: any) => i.value === d.item_id);

					// PERBAIKAN: Gunakan price dari data existing
					return {
						item_id: d.item_id,
						qty: d.qty,
						qty_keluar: d.qty_keluar,
						qty_delivery: d.qty_delivery || 0,
						price: d.price, // Gunakan price yang sudah ada
						priceKey: d.priceKey || packageLabel,
						name: d.name
					};
				});

				// Update detailFromParams untuk tracking perubahan quantity
				pageState.detailFromParams = [...itemDetails];

				formData.update((f) => ({ ...f, details: itemDetails }));
			}
		}
	});

	function formatIDR(value: number | string) {
		if (!value) return '';
		const num = Number(String(value).replace(/[^\d]/g, ''));
		return num.toLocaleString('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		});
	}

	function handleLabelInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.label = Number(raw || 0);
		target.value = formatIDR(raw);
	}
	function handleOngkirInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.ongkir = Number(raw || 0);
		target.value = formatIDR(raw);
	}
	function handleDownPaymentInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.down_payment = Number(raw || 0);
		target.value = formatIDR(raw);
	}
	function handleLableInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.biaya_label = Number(raw || 0);
		target.value = formatIDR(raw);
	}
	function handleDiscountInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.discount_amount = Number(raw || 0);
		target.value = formatIDR(raw);
	}

	function updateItemDiscount(itemId: string, event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		const discount = Number(raw || 0);
		itemDetails = itemDetails.map((item) =>
			item.item_id === itemId ? { ...item, discount } : item
		);
		formData.update((form) => ({ ...form, details: itemDetails }));
		target.value = formatIDR(raw);
	}

	function handleTotalAmountInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.total_amount = Number(raw || 0);
		target.value = formatIDR(raw);
	}
	let searchQuery = $state('');
	const LIMIT = 100;
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
				const description = String(item.deskripsi ?? '').toLowerCase();
				const combined = `${item.label ?? ''} ${item.deskripsi ?? ''}`.toLowerCase();

				return (
					label.includes(q) || value.includes(q) || description.includes(q) || combined.includes(q)
				);
			})
			.slice(0, LIMIT); // tetap batasi render
	});
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 md:px-8"
>
	<h2 class="text-xl font-bold sm:text-2xl">
		{pageState.isEditing ? 'Edit Purchase' : 'Create New Purchase'}
	</h2>

	<div class="grid grid-cols-1 items-center gap-4">
		<!-- PACKAGE -->
		<Form.Field {form} name="package_id">
			<Form.Control>
				<Form.Label>Package <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="package_id" bind:value={$formData.package_id}>
					<Select.Trigger class="w-full"
						>{packageLabel.toLowerCase() == 'shopee' ? 'Marketplace' : packageLabel}</Select.Trigger
					>
					<Select.Content class="text-xs">
						{#each packageOptions as p}
							<Select.Item
								class="text-xs"
								value={p.value}
								label={p.label.toLowerCase() == 'shopee' ? 'Marketplace' : p.label}
								>{p.label.toLowerCase() == 'shopee' ? 'Marketplace' : p.label}</Select.Item
							>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- ITEMS -->
		<Form.Field {form} name="details">
			<Form.Control>
				<Form.Label>Items <span class="text-red-500">*</span></Form.Label>
				<Popover.Root bind:open>
					<Popover.Trigger
						disabled={pageState.isStatusOpen}
						bind:ref={triggerRef}
						class="h-fit w-full"
					>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="h-6 min-h-[2.5rem] w-full justify-between overflow-hidden  text-left  font-normal "
								{...props}
								role="combobox"
							>
								<div class="flex h-6 w-96 flex-1 gap-1.5 overflow-hidden rounded-md">
									{#if selectedItems.length === 0}
										<span class="text-muted-foreground">Select items...</span>
									{:else}
										{#each [...selectedItems].sort((a, b) => {
											const itemA = itemOptions.find((i) => i.value === a);
											const itemB = itemOptions.find((i) => i.value === b);

											const textA = `${itemA?.label ?? ''} - ${itemA?.deskripsi ?? ''}`.toLowerCase();
											const textB = `${itemB?.label ?? ''} - ${itemB?.deskripsi ?? ''}`.toLowerCase();

											return textA.localeCompare(textB);
										}) as id}
											{@const item = itemOptions.find((i) => i.value === id)}
											<span
												class="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
											>
												{item?.label} - {item?.deskripsi} - {id}
											</span>
										{/each}
									{/if}
								</div>
								{#if selectedItems.length > 2}
									....
								{/if}
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[500px]  p-0" align="start">
						<div>
							<!-- <Command.Input placeholder="Search items..." class="h-9" /> -->
							<Input placeholder="Search items..." class="mb-3 h-9" bind:value={searchQuery} />
							<div class="">
								<!-- <Command.Empty>No items found.</Command.Empty> -->
								{#if filteredItems.length === 0}
									<div class="flex h-20 w-full items-center justify-center text-center">
										No items found.
									</div>
								{/if}
								<div class="max-h-[300px] space-y-2 overflow-auto">
									{#each filteredItems as item}
										<Button
											variant="ghost"
											value={item.value}
											onclick={() => toggleItem(item.value, item.label)}
											class="flex w-full items-center justify-between"
										>
											<div class="flex items-start justify-start gap-2">
												<CheckIcon
													class={cn(
														'size-4',
														!selectedItems.includes(item.value) && 'text-transparent'
													)}
												/>
												<div class="flex flex-col items-start">
													<span class="text-xs font-medium"
														>{item.label} {item.deskripsi ? '-' : ''} {item.deskripsi}</span
													>
													<span class="text-muted-foreground text-xs">
														{item.kode_barang}
													</span>
												</div>
											</div>
											<span class="text-muted-foreground text-xs">Stock: {item.stock}</span>
										</Button>
									{/each}
								</div>
							</div>

							{#if selectedItems.length > 0}
								<div class="flex items-center justify-between border-t p-2">
									<span class="text-muted-foreground text-xs">
										{selectedItems.length} selected
									</span>
									<Button
										size="sm"
										variant="ghost"
										onclick={closeAndFocusTrigger}
										class="h-7 text-xs"
									>
										Done
									</Button>
								</div>
							{/if}
						</div>
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.FieldErrors class=" text-sm text-red-600" />
		</Form.Field>
	</div>
	<!-- ITEM DETAILS -->
	{#if selectedItems.length > 0}
		<div class="mt-4 flex items-center justify-between text-sm font-medium">
			<div class="flex items-center gap-4">
				<span>
					Total Qty = {itemDetails.reduce((total: number, item: any) => total + (item.qty || 0), 0)}
				</span>
				<span>
					Total Price = {isShopeePackage
						? 'Rp 0'
						: formatIDR(
								itemDetails.reduce(
									(total: number, item: any) => total + (item.qty || 0) * (item.price || 0),
									0
								)
							)}
				</span>
			</div>
			<!-- {#if selectedItems.length > 3}
				<Button
					variant="outline"
					onclick={clearAll}
					title="Clear all"
					class="flex items-center gap-1 text-sm"
				>
					<XIcon class="text-destructive mb-0.5 ml-1 size-4" />
					<span>Delete All </span>
				</Button>
			{/if} -->
		</div>
		<div class="space-y-3">
			{#each [...itemDetails].sort((a, b) => {
				const itemA = itemOptions.find((i) => i.value === a.item_id);
				const itemB = itemOptions.find((i) => i.value === b.item_id);

				const textA = `${itemA?.label ?? ''} - ${itemA?.deskripsi ?? ''}`.toLowerCase();
				const textB = `${itemB?.label ?? ''} - ${itemB?.deskripsi ?? ''}`.toLowerCase();

				return textA.localeCompare(textB);
			}) as detail, index (detail.item_id)}
				{@const item = itemOptions.find((i) => i.value === detail.item_id)}
				{@const subtotal = Math.max((detail.price ?? 0) * detail.qty - (detail.discount ?? 0), 0)}
				{@const detailFromParam =
					pageState?.detailFromParams?.find((d) => d.item_id === detail.item_id) ?? {}}
				{@const minQty = Math.max(1, detailFromParam.qty_keluar ?? 0)}

				<div class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:justify-between">
					<div class="flex flex-col">
						<p class="text-sm font-medium">
							{item?.label} - {item?.deskripsi} - {item?.kode_barang}
						</p>
						<div class="text-muted-foreground text-sm">
							Stock: {item?.stock} • {#if isShopeePackage}
								<span class="text-red-500">Rp 0 (Marketplace)</span>
							{:else}
								Rp {detail.price?.toLocaleString('id-ID')}
							{/if} • Qty Keluar : {detailFromParam.qty_keluar ?? 0} • Qty Delivery : {detailFromParam.qty_delivery ??
								0}
						</div>
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<span class="text-muted-foreground text-sm">Qty:</span>
							<div class="flex items-center overflow-hidden rounded-lg border">
								<button
									type="button"
									class="hover:bg-muted px-3 py-1 transition disabled:cursor-not-allowed disabled:opacity-50"
									onclick={() =>
										updateQty(
											detail.item_id,
											detail.qty - 1,
											detailFromParam.qty ?? detail.qty,
											item?.label,
											detailFromParam.qty_keluar ?? 0
										)}
									disabled={detail.qty <= minQty}>−</button
								>

								<input
									type="number"
									min={minQty}
									class="bg-muted w-16 py-1 text-center text-sm font-medium focus:outline-none"
									bind:value={detail.qty}
									onchange={(e) => {
										const newValue = parseInt(e.currentTarget.value) || minQty;
										updateQty(
											detail.item_id,
											newValue,
											detailFromParam.qty ?? detail.qty,
											item?.label,
											detailFromParam.qty_keluar ?? 0
										);
									}}
								/>

								<button
									type="button"
									class="hover:bg-muted px-3 py-1 transition"
									onclick={() =>
										updateQty(
											detail.item_id,
											detail.qty + 1,
											detailFromParam.qty ?? detail.qty,
											item?.label,
											detailFromParam.qty_keluar ?? 0
										)}>+</button
								>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-muted-foreground text-sm">Discount:</span>
							<input
								type="text"
								inputmode="numeric"
								value={formatIDR(detail.discount ?? 0)}
								oninput={(e) => updateItemDiscount(detail.item_id, e)}
								placeholder="Rp 0"
								aria-label={`Discount ${item?.label}`}
								class="h-8 w-28 rounded-md border border-gray-300 px-2 text-xs outline-none focus:border-blue-500"
							/>
						</div>
						<div class="w-32 text-right">
							<p class="text-muted-foreground text-xs">Subtotal</p>
							{#if !isShopeePackage}
								<p class="font-semibold">Rp {subtotal?.toLocaleString('id-ID')}</p>
							{:else}
								<p class="font-semibold">Rp 0</p>
							{/if}
						</div>
						<button
							type="button"
							onclick={(e) => {
								if (detailFromParam.qty_keluar > 0) {
									toast.error(
										`Cannot remove item ${item?.label} because qty keluar is greater than 0.`
									);
									return;
								} else {
									removeItem(item?.kode_barang, e, item?.label!);
								}
							}}
							class="hover:text-destructive transition"
						>
							<XIcon class="size-3" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- FORM FIELDS -->
	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
		<!-- CUSTOMER -->
		<Form.Field {form} name="customer_id">
			<Form.Control>
				<Form.Label>Customer <span class="text-red-500">*</span></Form.Label>
				<Popover.Root bind:open={customerOpen}>
					<Popover.Trigger bind:ref={customerTriggerRef} class="w-full">
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-full justify-between text-left font-normal"
								{...props}
								role="combobox"
							>
								<span
									class={cn(!$formData.customer_id && 'text-muted-foreground', 'w-full text-left')}
								>
									{customerLabel}
								</span>
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[300px] p-0" align="start">
						<Command.Root>
							<Command.Input placeholder="Search customer..." class="h-9" />
							<Command.List>
								<Command.Empty>No customer found.</Command.Empty>
								<Command.Group>
									{#each customerOptions as customer}
										<Command.Item
											value={customer.label}
											keywords={[customer.label, customer.value]}
											onSelect={() => selectCustomer(customer.value)}
											class="flex items-center gap-2 text-xs"
										>
											<CheckIcon
												class={cn(
													'size-4',
													$formData.customer_id !== customer.value && 'text-transparent'
												)}
											/>
											<span>{customer.label}</span>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- STATUS -->
		<Form.Field {form} name="payment_status">
			<Form.Control>
				<Form.Label>Payment Status <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="payment_status" bind:value={$formData.payment_status}>
					<Select.Trigger class="w-full">{paymentStatusLabel}</Select.Trigger>
					<Select.Content>
						{#each paymentStatusOptions as s}
							<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
		<!-- STATUS -->
		<Form.Field {form} name="status_po">
			<Form.Control>
				<Form.Label>Status PO <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="status_po" bind:value={$formData.status_po}>
					<Select.Trigger class="w-full">{statusPoLabel}</Select.Trigger>
					<Select.Content>
						{#each statusPoOptions as s}
							<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- DOWN PAYMENT -->
		{#if $formData.payment_status === 'DP'}
			<Form.Field {form} name="down_payment">
				<Form.Control>
					<Form.Label>Down Payment <span class="text-red-500">*</span></Form.Label>
					<!-- <Input type="number" placeholder="0" bind:value={$formData.down_payment} /> -->
					<Input
						type="text"
						inputmode="numeric"
						placeholder="Input Down Payment"
						value={formatIDR($formData.down_payment)}
						oninput={handleDownPaymentInput}
						class="text-left"
					/>
				</Form.Control>
				<Form.FieldErrors class="text-sm text-red-600" />
			</Form.Field>
		{/if}

		<!-- PAYMENT METHOD -->
		<Form.Field {form} name="payment_method">
			<Form.Control>
				<Form.Label>Payment Method <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="payment_method" bind:value={$formData.payment_method}>
					<Select.Trigger class="w-full">{paymentLabel}</Select.Trigger>
					<Select.Content class="text-xs">
						{#each paymentOptions as p}
							<Select.Item class="text-xs" value={p.value} label={p.label}>{p.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<Form.Field {form} name="labels">
			<Form.Control>
				<Form.Label>Additional Item</Form.Label>
				<Popover.Root bind:open={labelOpen}>
					<Popover.Trigger class="h-fit w-full">
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="min-h-[2.5rem] w-full justify-between text-left font-normal"
								{...props}
								role="combobox"
							>
								<div class="flex flex-1 flex-wrap items-center gap-1.5">
									{#if selectedLabels.length === 0}
										<span class="text-muted-foreground">Select labels...</span>
									{:else}
										{#each selectedLabels as labelObj}
											{@const label = lblOptions.find((l) => l.value === labelObj.label_id)}
											<div class="flex items-center gap-1">
												<span
													class="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
												>
													{label?.label} (Qty: {labelObj.qty})
													<button
														type="button"
														onclick={(e) => removeLabel(labelObj.label_id, e)}
														class="hover:text-destructive ml-1 transition"
													>
														<XIcon class="size-3" />
													</button>
												</span>
											</div>
										{/each}
										{#if selectedLabels.length > 2}
											<button type="button" onclick={clearAllLabels} title="Clear all labels">
												<XIcon class="text-destructive ml-1 size-4" />
											</button>
										{/if}
									{/if}
								</div>
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[400px] p-0" align="start">
						<Command.Root>
							<Command.Input placeholder="Search labels..." class="h-9" />
							<Command.List>
								<Command.Empty>No labels found.</Command.Empty>
								<Command.Group>
									{#each lblOptions as label}
										{@const selectedLabel = selectedLabels.find((l) => l.label_id === label.value)}
										<Command.Item
											value={label.value}
											keywords={[label.label, label.value]}
											onSelect={() => toggleLabel(label.value, label.price)}
											class="flex items-center justify-between p-2 text-xs"
										>
											<div class="flex items-center gap-2">
												<CheckIcon class={cn('size-4', !selectedLabel ? 'text-transparent' : '')} />
												<div class="flex flex-col">
													<span class="font-bold">{label.label}</span>
													<span class="font-normal">{formatIDR(label.price)}</span>
												</div>
											</div>

											{#if selectedLabel}
												<div class="flex items-center gap-1">
													<button
														type="button"
														class="hover:bg-muted rounded p-1 transition disabled:opacity-50"
														onclick={(e) => {
															e.stopPropagation();
															updateLabelQty(selectedLabel.label_id, selectedLabel.qty - 1);
														}}
														disabled={selectedLabel.qty <= 1}>−</button
													>
													<span class="w-8 text-center font-medium">{selectedLabel.qty}</span>
													<button
														type="button"
														class="hover:bg-muted rounded p-1 transition"
														onclick={(e) => {
															e.stopPropagation();
															updateLabelQty(selectedLabel.label_id, selectedLabel.qty + 1);
														}}>+</button
													>
												</div>
											{/if}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>

							{#if selectedLabels.length > 0}
								<div class="flex items-center justify-between border-t p-2">
									<span class="text-muted-foreground text-xs">
										{selectedLabels.length} label(s) selected
									</span>
									<Button
										size="sm"
										variant="ghost"
										onclick={() => (labelOpen = false)}
										class="h-7 text-xs"
									>
										Done
									</Button>
								</div>
							{/if}
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- ONGKIR -->
		<Form.Field {form} name="ongkir">
			<Form.Control>
				<Form.Label>Ongkir</Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Ongkir"
					value={formatIDR($formData.ongkir)}
					oninput={handleOngkirInput}
					class="text-left"
				/>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
		<!-- DISCOUNT -->
		<Form.Field {form} name="biaya_label">
			<Form.Control>
				<Form.Label>Biaya Pemasangan Label</Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Biaya Label"
					value={formatIDR($formData.biaya_label)}
					oninput={handleLableInput}
					class="text-left"
				/>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
		<Form.Field {form} name="discount_amount">
			<Form.Control>
				<Form.Label>Discount Amount</Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Discount Amount"
					value={formatIDR($formData.discount_amount)}
					oninput={handleDiscountInput}
					class="text-left"
				/>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- KETERANGAN -->
		<Form.Field {form} name="keterangan">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea placeholder="description" bind:value={$formData.keterangan} />
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
	</div>

	{#if isShopeePackage}
		<Form.Field {form} name="total_amount">
			<Form.Control>
				<Form.Label required>Total Amount (Manual)</Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Total Amount"
					value={formatIDR($formData.total_amount)}
					oninput={handleTotalAmountInput}
					class="text-left"
				/>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
	{/if}

	<!-- TOTAL SUMMARY -->
	<!-- <div class="rounded-lg border bg-gray-50 p-4">
		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-gray-600">Total Amount:</span>
				<span class="font-medium">Rp {($formData.total_amount ?? 0).toLocaleString('id-ID')}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600">Discount:</span>
				<span class="font-medium text-red-600">- Rp {($formData.biaya_label ?? 0).toLocaleString('id-ID')}</span>
			</div>
			<div class="flex justify-between border-t pt-2 text-base font-bold">
				<span>Final Amount:</span>
				<span class="text-green-600">Rp {($formData.final_amount ?? 0).toLocaleString('id-ID')}</span>
			</div>
			{#if $formData.status === 'DP' && $formData.down_payment}
				<div class="flex justify-between text-sm text-gray-600">
					<span>Down Payment:</span>
					<span>Rp {($formData.down_payment ?? 0).toLocaleString('id-ID')}</span>
				</div>
				<div class="flex justify-between text-sm font-medium text-orange-600">
					<span>Remaining:</span>
					<span>Rp {(($formData.final_amount ?? 0) - ($formData.down_payment ?? 0)).toLocaleString('id-ID')}</span>
				</div>
			{/if}
		</div>
	</div> -->

	<!-- BUTTONS -->
	<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
		<Button
			type="button"
			variant="outline"
			class="w-full sm:w-auto"
			onclick={() => goto('/purchase')}
		>
			Cancel
		</Button>

		<Button type="submit" class="w-full sm:w-auto">
			{pageState.isEditing ? 'Update Purchase' : 'Save Purchase'}
		</Button>
	</div>
</form>
