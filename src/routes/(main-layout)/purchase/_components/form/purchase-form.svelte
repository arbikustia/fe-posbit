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

	const { form, handleSubmit, state: pageState } = usePurchasePage();
	const { form: formData, enhance, errors } = form;

	// === OPTIONS ===
	const itemOptions = $derived(pageState.listItem ?? []);

	let customerOptions: { value: string; label: string }[] = $state([]);
	let packageOptions: { value: string; label: string }[] = $state([]);
	let lblOptions: { value: string; label: string , price:number}[] = $state([]);
	let selectedLabels = $state<string[]>([]);

	// === STATES ===
	let selectedItems = $state<string[]>([]);
	let itemDetails = $state<
		{ item_id: string; qty: number; price: number; priceKey: string; name: string }[]
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

	function removeItem(itemValue: string, e: Event, label: string) {
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
			// Preserve existing price if in edit mode, otherwise calculate
			const price = existing?.price || getItemPriceByPackage(item, packageLabel);
			const priceKey = existing?.priceKey || packageLabel;
			const name = existing?.name;
			return { item_id: id, qty, price, priceKey, name };
		});

		itemDetails = mapped;
		formData.update((f) => ({ ...f, details: mapped }));
	}

	// === UPDATE QUANTITY ===
	function updateQty(id: string, newQty: number, oldQty: number, name: string, qty_keluar: number) {
		const item = pageState.listItem.find((i) => i.value === id);
		console.log(qty_keluar ?? 0, 'lolo');
		if (!item) return;

		// Hanya batasi minimal (tidak boleh kurang dari qty_keluar), tidak ada batas maksimal
		const minQty = Math.max(1, qty_keluar ?? 0); // Minimal tidak boleh kurang dari qty_keluar atau 1

		// Tidak ada batasan maksimal, jadi qty bisa lebih dari stock
		const qty = Math.max(minQty, newQty);

		const detail = itemDetails.find((d) => d.item_id === id);
		const price = detail?.price || getItemPriceByPackage(item, packageLabel);
		const priceKey = detail?.priceKey || packageLabel;

		const updated = itemDetails.map((i) => (i.item_id === id ? { ...i, qty, price, priceKey } : i));
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

	$effect(() => {
		if (
			$formData.package_id !== previousPackageId &&
			itemDetails.length > 0 &&
			previousPackageId !== undefined
		) {
			previousPackageId = $formData.package_id;

			const updated = itemDetails.map((detail) => {
				const item = pageState.listItem.find((i) => i.value === detail.item_id);
				const price = getItemPriceByPackage(item, packageLabel);
				return { ...detail, price, priceKey: packageLabel };
			});

			itemDetails = updated;
			formData.update((f) => ({ ...f, details: updated }));
		} else if (previousPackageId === undefined && $formData.package_id) {
			previousPackageId = $formData.package_id;
		}
	});

	// === AUTO CALCULATE TOTAL ===
	$effect(() => {
		let total = 0;

		if (isShopeePackage) {
			// Untuk package shopee, gunakan manual total_amount
			total = 0;
		} else {
			// Untuk package lainnya, hitung otomatis
			total = itemDetails.reduce((sum, detail) => sum + (detail.price ?? 0) * detail.qty, 0);
		}

		formData.update((f) => ({
			...f,
			total_amount: total,
			final_amount: total - (f.discount_amount ?? 0),
			labels: selectedLabels.map((id) => ({ label_id: id }))
		}));
	});

	// === INITIALIZE FORM DATA ON MOUNT ===
	// === INITIALIZE FORM DATA ON MOUNT ===
	onMount(async () => {
		// --- DECODE KETERANGAN DARI URL/QUERY (jika ada) ---
		const qp = new URLSearchParams(window.location.search);
		const rawKeterangan = qp.get('keterangan') ?? '';
		if (rawKeterangan) {
			const decodedKeterangan = decodeURIComponent(decodeURIComponent(rawKeterangan));
			console.warn(decodedKeterangan,'decodedKeterangan')
			formData.update((f) => ({ ...f, keterangan: decodedKeterangan }));
		}
		const rawLabels = qp.get('labels') ?? '';
		if (rawLabels) {
			const decodedLabels = decodeURIComponent(decodeURIComponent(rawLabels));
			console.warn(JSON.parse(decodedLabels),'decodedLabels')
			formData.update((f) => ({ ...f, labels: JSON.parse(decodedLabels) }));
		}
		
		

		// Load labels
		try {
			const labelRes: any = await purchaseService.getDataLabel(); // Sesuaikan dengan service Anda
			lblOptions = labelRes.data.data.map((item: { id: string; name: string , price:number}) => ({
				value: item.id,
				label: item.name,
				price:item.price
			}));
			
			// Restore labels dari formData (untuk edit mode)
			// Cek apakah menggunakan key 'label' atau 'labels'
			console.warn($formData.labels,'okokoko')
			const labelsData = $formData.labels || $formData.labels;
			if (labelsData && labelsData.length > 0) {
				selectedLabels = labelsData.map((l: any) => l.label_id);
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
			if ($formData.details && $formData.details.length > 0) {
				selectedItems = $formData.details.map((d: any) => d.item_id);

				itemDetails = $formData.details.map((d: any) => {
					const item = pageState.listItem.find((i: any) => i.value === d.item_id);
					const price = getItemPriceByPackage(item, packageLabel);
					return {
						item_id: d.item_id,
						qty: d.qty,
						qty_keluar: d.qty_keluar,
						price: price,
						priceKey: packageLabel,
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

	function handleTotalAmountInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.total_amount = Number(raw || 0);
		target.value = formatIDR(raw);
	}
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

	<div class="grid grid-cols-2 items-center gap-4">
		<!-- PACKAGE -->
		<Form.Field {form} name="package_id">
			<Form.Control>
				<Form.Label>Package <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="package_id" bind:value={$formData.package_id}>
					<Select.Trigger class="w-full">{packageLabel}</Select.Trigger>
					<Select.Content class="text-xs">
						{#each packageOptions as p}
							<Select.Item class="text-xs" value={p.value} label={p.label}>{p.label}</Select.Item>
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
					<Popover.Trigger bind:ref={triggerRef} class="h-fit w-full">
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="min-h-[2.5rem] w-full justify-between text-left font-normal"
								{...props}
								role="combobox"
							>
								<div class="flex flex-1 flex-wrap gap-1.5">
									{#if selectedItems.length === 0}
										<span class="text-muted-foreground">Select items...</span>
									{:else}
										{#each selectedItems as id}
											{@const item = itemOptions.find((i) => i.value === id)}
											<span
												class="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
											>
												{item?.label}
												<button
													type="button"
													onclick={(e) => removeItem(id, e, item?.label!)}
													class="hover:text-destructive transition"
												>
													<XIcon class="size-3" />
												</button>
											</span>
										{/each}
										{#if selectedItems.length > 3}
											<button type="button" onclick={clearAll} title="Clear all">
												<XIcon class="text-destructive ml-1 size-4" />
											</button>
										{/if}
									{/if}
								</div>
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[500px] p-0" align="start">
						<Command.Root>
							<Command.Input placeholder="Search items..." class="h-9" />
							<Command.List>
								<Command.Empty>No items found.</Command.Empty>
								<Command.Group>
									{#each itemOptions as item}
										<Command.Item
											value={item.value}
											keywords={[item.label, item.value, item.deskripsi]}
											onSelect={() => toggleItem(item.value, item.label)}
											class="flex items-center justify-between"
										>
											<div class="flex items-center gap-2">
												<CheckIcon
													class={cn(
														'size-4',
														!selectedItems.includes(item.value) && 'text-transparent'
													)}
												/>
												<div class="flex flex-col">
													<span class="text-xs font-medium"
														>{item.label} {item.deskripsi ? '-' : ''} {item.deskripsi}</span
													>
													<span class="text-muted-foreground text-xs">
														{item.kode_barang}
													</span>
												</div>
											</div>
											<span class="text-muted-foreground text-xs">Stock: {item.stock}</span>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>

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
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.FieldErrors class=" text-sm text-red-600" />
		</Form.Field>
	</div>

	<!-- ITEM DETAILS -->
	{#if selectedItems.length > 0}
		<div class="space-y-3">
			{#each itemDetails as detail, index (detail.item_id)}
				{@const item = itemOptions.find((i) => i.value === detail.item_id)}
				{@const subtotal = (detail.price ?? 0) * detail.qty}
				{@const minQty = Math.max(1, pageState?.detailFromParams?.[index]?.qty_keluar || 0)}

				<div class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:justify-between">
					<div class="flex flex-col">
						<p class="text-sm font-medium">{item?.label} - {item?.deskripsi}</p>
						<div class="text-muted-foreground text-sm">
							Stock: {item?.stock} • {#if isShopeePackage}
								<span class="text-red-500">Rp 0 (Shopee)</span>
							{:else}
								Rp {detail.price?.toLocaleString('id-ID')}
							{/if} • Qty Keluar : {pageState?.detailFromParams?.[index]?.qty_keluar ?? 0}
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
											pageState?.detailFromParams?.[index]?.qty,
											item?.label,
											pageState?.detailFromParams?.[index]?.qty_keluar
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
											pageState?.detailFromParams?.[index]?.qty,
											item?.label,
											pageState?.detailFromParams?.[index]?.qty_keluar
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
											pageState?.detailFromParams?.[index]?.qty,
											item?.label,
											pageState?.detailFromParams?.[index]?.qty_keluar
										)}>+</button
								>
							</div>
						</div>
						<div class="w-32 text-right">
							<p class="text-muted-foreground text-xs">Subtotal</p>
							<p class="font-semibold">Rp {subtotal?.toLocaleString('id-ID')}</p>
						</div>
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
					<Input type="number" placeholder="0" bind:value={$formData.down_payment} />
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

		<!-- LABEL -->
		<!-- <Form.Field {form} name="label">
			<Form.Control>
				<Form.Label>Label</Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Label"
					value={formatIDR($formData.label)}
					oninput={handleLabelInput}
					class="text-left"
				/>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field> -->

		<Form.Field {form} name="labels">
			<Form.Control>
				<Form.Label>Label</Form.Label>
				<Popover.Root>
					<Popover.Trigger class="w-full">
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="min-h-[2.5rem] w-full justify-between text-left font-normal"
								{...props}
								role="combobox"
							>
								<div class="flex flex-1 flex-wrap gap-1.5">
									{#if selectedLabels.length === 0}
										<span class="text-muted-foreground">Select labels...</span>
									{:else}
										{#each selectedLabels as labelId}
											{@const label = lblOptions.find((l) => l.value === labelId)}
											<span
												class="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
											>
												{label?.label}
												<button
													type="button"
													onclick={(e) => {
														e.stopPropagation();
														selectedLabels = selectedLabels.filter((id) => id !== labelId);
													}}
													class="hover:text-destructive transition"
												>
													<XIcon class="size-3" />
												</button>
											</span>
										{/each}
									{/if}
								</div>
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[300px] p-0" align="start">
						<Command.Root>
							<Command.Input placeholder="Search labels..." class="h-9" />
							<Command.List>
								<Command.Empty>No labels found.</Command.Empty>
								<Command.Group>
									{#each lblOptions as label}
										<Command.Item
											value={label.value}
											keywords={[label.label, label.value]}
											onSelect={() => {
												if (selectedLabels.includes(label.value)) {
													selectedLabels = selectedLabels.filter((id) => id !== label.value);
												} else {
													selectedLabels = [...selectedLabels, label.value];
												}
											}}
											class="flex items-center gap-2 text-xs"
										>
											<CheckIcon
												class={cn(
													'size-4',
													!selectedLabels.includes(label.value) && 'text-transparent'
												)}
											/>
											<div class="flex flex-col">
												<span class="font-bold">{label.label}</span>
												<span class="font-normal">{formatIDR(label.price)}</span>
											</div>
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

		<!-- KETERANGAN -->
		<Form.Field {form} name="keterangan">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea placeholder="description" bind:value={$formData.keterangan} />
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- DISCOUNT -->
		<Form.Field {form} name="discount_amount">
			<Form.Control>
				<Form.Label>Discount</Form.Label>
				<Input type="number" placeholder="0" bind:value={$formData.discount_amount} />
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
	</div>

	{#if isShopeePackage}
		<Form.Field {form} name="total_amount">
			<Form.Control>
				<Form.Label>Total Amount (Manual) <span class="text-red-500">*</span></Form.Label>
				<Input
					type="text"
					inputmode="numeric"
					placeholder="Input Total Amount"
					value={formatIDR($formData.total_amount)}
					oninput={handleTotalAmountInput}
					class="text-left"
				/>
			</Form.Control>
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
				<span class="font-medium text-red-600">- Rp {($formData.discount_amount ?? 0).toLocaleString('id-ID')}</span>
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
