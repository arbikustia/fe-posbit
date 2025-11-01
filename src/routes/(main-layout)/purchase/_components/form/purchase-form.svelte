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

	const { form, handleSubmit, state: pageState } = usePurchasePage();
	const { form: formData, enhance, errors } = form;

	// === OPTIONS ===

	// Derived reactive item options
	const itemOptions = $derived(pageState.listItem ?? []);

	let customerOptions = $state([]);

	onMount(() => {
		customerService
			.getDataPerson()
			.then((res: any) => {
				customerOptions = res.data.data.map((customer: any, index: number) => ({
					value: customer.id ?? `customer-${index}`,
					label: customer.firstname + ' ' + customer.lastname
				}));
				console.log(res.data, 'ofofo');
			});
	});
	const statusOptions = [
		{ value: 'LUNAS', label: 'Lunas' },
		{ value: 'DP', label: 'DP' },
		{ value: 'CANCEL', label: 'Cancelled' }
	];

	const paymentOptions = [
		{ value: 'CASH', label: 'Cash' },
		{ value: 'DEBIT', label: 'Debit' }
	];

	// === STATES ===
	let selectedItems = $state<string[]>([]);
	let itemDetails = $state<{ item_id: string; qty: number }[]>([]);

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	// Customer combobox state
	let customerOpen = $state(false);
	let customerTriggerRef = $state<HTMLButtonElement>(null!);

	// Derived labels for display
	const customerLabel = $derived(
		customerOptions.find((r) => r.value === $formData.customer_id)?.label ?? 'Select Customer'
	);
	const statusLabel = $derived(
		statusOptions.find((r) => r.value === $formData.status)?.label ?? 'Select Status'
	);
	const paymentLabel = $derived(
		paymentOptions.find((r) => r.value === $formData.payment_method)?.label ??
			'Select Payment Method'
	);

	// === TOGGLE ITEMS ===
	function toggleItem(itemValue: string) {
		if (selectedItems.includes(itemValue)) {
			selectedItems = selectedItems.filter((id) => id !== itemValue);
		} else {
			selectedItems = [...selectedItems, itemValue];
		}
		syncSelectedItems(); // 🔥 sync manual
	}

	function removeItem(itemValue: string, e: Event) {
		e.stopPropagation();
		selectedItems = selectedItems.filter((id) => id !== itemValue);
		syncSelectedItems(); // 🔥 sync manual
	}

	function clearAll(e: Event) {
		e.stopPropagation();
		selectedItems = [];
		syncSelectedItems(); // 🔥 sync manual
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
			const price = getItemPriceByQty(item, qty);
			const priceKey = getPriceKey(qty);
			return { item_id: id, qty, price, priceKey };
		});

		itemDetails = mapped;
		formData.update((f) => ({ ...f, details: mapped }));
	}

	// === UPDATE QUANTITY ===
	function updateQty(id: string, newQty: number) {
		const item = pageState.listItem.find((i) => i.value === id);
		if (!item) return;

		const qty = Math.max(1, Math.min(newQty, item.stock));
		const price = getItemPriceByQty(item, qty);
		const priceKey = getPriceKey(qty);

		const updated = itemDetails.map((i) => (i.item_id === id ? { ...i, qty, price, priceKey } : i));
		itemDetails = updated;
		formData.update((f) => ({ ...f, details: updated }));
	}

	// === AUTO CALCULATE TOTAL ===
	$effect(() => {
		const total = itemDetails.reduce((sum, detail) => sum + (detail.price ?? 0) * detail.qty, 0);
		formData.update((f) => ({
			...f,
			total_amount: total,
			final_amount: total - (f.discount_amount ?? 0)
		}));
	});

	function getPriceKey(qty: number) {
		if (qty >= 2000) return 'F';
		if (qty >= 1000) return 'E';
		if (qty >= 600) return 'D';
		if (qty >= 300) return 'C';
		if (qty >= 100) return 'B';
		if (qty >= 50) return 'A';
		return 'default';
	}
	function getItemPriceByQty(item: any, qty: number) {
		if (!item) return 0;
		const key = getPriceKey(qty);
		switch (key) {
			case 'F':
				return item.harga_f;
			case 'E':
				return item.harga_e;
			case 'D':
				return item.harga_d;
			case 'C':
				return item.harga_c;
			case 'B':
				return item.harga_b;
			case 'A':
				return item.harga_a;
			default:
				return item.harga;
		}
	}
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 md:px-8"
>
	<h2 class="text-xl font-bold sm:text-2xl">Create New Purchase</h2>

	<!-- ITEMS -->
	<Form.Field {form} name="details">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700"
				>Items <span class="text-red-500">*</span></Form.Label
			>
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
												onclick={(e) => removeItem(id, e)}
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

				<Popover.Content class="w-[500px] p-0">
					<Command.Root>
						<Command.Input placeholder="Search items..." class="h-9" />
						<Command.List>
							<Command.Empty>No items found.</Command.Empty>
							<Command.Group>
								{#each itemOptions as item}
									<Command.Item
										value={item.value}
										keywords={[item.label, item.value]}
										onSelect={() => toggleItem(item.value)}
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
												<span class="text-sm font-medium">{item.label}</span>
												<span class="text-muted-foreground text-xs">
													<!-- Rp {getItemPriceByQty(item, 50)?.toLocaleString('id-ID')} -->
													<!-- minimal 50 -->
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

	<!-- ITEM DETAILS -->
	{#if selectedItems.length > 0}
		<div class="space-y-3">
			{#each itemDetails as detail (detail.item_id)}
				{@const item = itemOptions.find((i) => i.value === detail.item_id)}
				{@const subtotal = (detail.price ?? 0) * detail.qty}

				<div class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:justify-between">
					<div class="flex flex-col">
						<p class="font-medium">{item?.label}</p>
						<div class="text-muted-foreground text-sm">
							Stock: {item?.stock} • Price: Rp {getItemPriceByQty(item, detail.qty)?.toLocaleString(
								'id-ID'
							)}
						</div>
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<span class="text-muted-foreground text-sm">Qty:</span>
							<div class="flex items-center overflow-hidden rounded-lg border">
								<button
									type="button"
									class="hover:bg-muted px-3 py-1 transition"
									onclick={() => updateQty(detail.item_id, detail.qty - 1)}>−</button
								>
								<div class="bg-muted w-12 py-1 text-center text-sm font-medium">{detail.qty}</div>
								<button
									type="button"
									class="hover:bg-muted px-3 py-1 transition"
									onclick={() => updateQty(detail.item_id, detail.qty + 1)}>+</button
								>
							</div>
						</div>
						<div class="text-right">
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
		<!-- CUSTOMER (SEARCHABLE) -->
		<Form.Field {form} name="customer_id">
			<Form.Control>
				<Form.Label>Customer <span class="text-red-500">*</span></Form.Label>
				<Popover.Root bind:open={customerOpen}>
					<Popover.Trigger bind:ref={customerTriggerRef} class="w-full">
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="flex w-full items-start bg-red-600 text-start font-normal"
								{...props}
								role="combobox"
							>
								<span
									class={cn(
										!$formData.customer_id && 'text-muted-foreground w-full text-start',
										'w-full text-start'
									)}
								>
									{customerLabel}
								</span>
								<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="w-[300px] p-0">
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
											class="flex items-center gap-2"
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
		<Form.Field {form} name="status">
			<Form.Control>
				<Form.Label>Status <span class="text-red-500">*</span></Form.Label>
				<Select.Root type="single" name="status" bind:value={$formData.status}>
					<Select.Trigger class="w-full">{statusLabel}</Select.Trigger>
					<Select.Content>
						{#each statusOptions as s}
							<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- DOWN PAYMENT: Hanya muncul jika status DP -->
		{#if $formData.status === 'DP'}
			<Form.Field {form} name="down_payment">
				<Form.Control>
					<Form.Label>Down Payment</Form.Label>
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
					<Select.Content>
						{#each paymentOptions as p}
							<Select.Item value={p.value} label={p.label}>{p.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>

		<!-- DISCOUNT -->
		<!-- <Form.Field {form} name="discount_amount">
			<Form.Control>
				<Form.Label>Discount</Form.Label>
				<Input type="number" placeholder="0" bind:value={$formData.discount_amount} />
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field> -->

		<!-- KETERANGAN -->
		<Form.Field {form} name="keterangan">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea placeholder="description" bind:value={$formData.keterangan} />
			</Form.Control>
			<Form.FieldErrors class="text-sm text-red-600" />
		</Form.Field>
	</div>

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

		<Button type="submit" class="w-full sm:w-auto">Save Purchase</Button>
	</div>
</form>
