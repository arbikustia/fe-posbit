<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { invoiceSchema } from './schema';
	import { goto } from '$app/navigation';

	type InvoiceFormProps = {
		form: SuperForm<z.infer<typeof invoiceSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: InvoiceFormProps = $props();
	const { form: formData, enhance } = form;

	// === DATA PILIHAN ===
	const itemOptions = [
		{ value: '1', label: 'Laptop Lenovo', stock: 15 },
		{ value: '2', label: 'Keyboard Logitech', stock: 30 },
		{ value: '3', label: 'Monitor LG', stock: 10 }
	];

	const customerOptions = [
		{ value: '1', label: 'John Doe' },
		{ value: '2', label: 'Putri Maharani' },
		{ value: '3', label: 'Budi Santoso' }
	];

	const statusOptions = [
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Paid', label: 'Paid' },
		{ value: 'Cancelled', label: 'Cancelled' }
	];

	const paymentOptions = [
		{ value: 'Cash', label: 'Cash' },
		{ value: 'Credit Card', label: 'Credit Card' },
		{ value: 'Transfer', label: 'Transfer' }
	];

	// === STATE ===
	let selectedItems = $state<string[]>([]);
	let itemDetails = $state<{ id: string; qty: number }[]>([]);

	let statusValue = $state('');
	let paymentValue = $state('');

	// derived labels
	const statusLabel = $derived(
		statusOptions.find((r) => r.value === statusValue)?.label ?? 'Select Status'
	);
	const paymentLabel = $derived(
		paymentOptions.find((r) => r.value === paymentValue)?.label ?? 'Select Payment Method'
	);

	// sinkronisasi item details dengan selectedItems
	$effect(() => {
		itemDetails = selectedItems.map((id) => {
			const existing = itemDetails.find((d) => d.id === id);
			return existing ?? { id, qty: 1 };
		});
	});

	// === UPDATE QTY ===
	function updateQty(id: string, newQty: number) {
		const updated = itemDetails.map((item) =>
			item.id === id ? { ...item, qty: Math.max(1, newQty) } : item
		);
		itemDetails = updated; // ⬅️ reaktifkan perubahan
	}
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-base font-bold sm:text-lg md:text-xl">Create New Purchase</h2>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<!-- === ITEM SELECT MULTIPLE === -->
		<div class="col-span-2">
			<Form.Field {form} name="item_id">
				<Form.Control>
					<Form.Label>Items</Form.Label>
					<Select.Root type="multiple" name="item_id" bind:value={selectedItems}>
						<Select.Trigger class="w-full rounded-md border px-3 py-2 text-sm">
							{#if selectedItems.length > 0}
								{selectedItems
									.map((id) => itemOptions.find((r) => r.value === id)?.label)
									.join(', ')}
							{:else}
								Select Items
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Select Items</Select.Label>
								{#each itemOptions as i (i.value)}
									<Select.Item value={i.value} label={i.label}>
										{i.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if selectedItems.length > 0}
				<div class="">
					<div class="space-y-3">
						{#each itemDetails as detail (detail.id)}
							{@const item = itemOptions.find((i) => i.value === detail.id)}
							<div
								class="flex flex-col gap-3 rounded-lg border border-gray-700 p-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="flex flex-col sm:flex-row sm:gap-6">
									<p class="text-sm font-medium text-gray-900">{item?.label}</p>
									<p class="text-xs text-gray-400">Stock: {item?.stock}</p>
								</div>

								<!-- === QTY DISPLAY WITH + / - BUTTONS === -->
								<div class="flex items-center gap-3">
									<span class="text-xs text-gray-400">Qty:</span>

									<div class="flex items-center overflow-hidden rounded-lg border border-gray-600">
										<!-- tombol minus -->
										<button
											type="button"
											class="px-2 py-1 text-gray-300 transition hover:bg-gray-700"
											onclick={() => updateQty(detail.id, Math.max(1, detail.qty - 1))}
										>
											−
										</button>

										<!-- qty display -->
										<div class="w-12 bg-gray-800 text-center text-sm text-white select-none">
											{detail.qty}
										</div>

										<!-- tombol plus -->
										<button
											type="button"
											class="px-2 py-1 text-gray-300 transition hover:bg-gray-700"
											onclick={() => updateQty(detail.id, detail.qty + 1)}
										>
											＋
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<!-- === CUSTOMER === -->
		<Form.Field {form} name="cust_id">
			<Form.Control>
				<Form.Label>Customer</Form.Label>
				<Select.Root type="single" name="cust_id" bind:value={$formData.cust_id}>
					<Select.Trigger class="w-full rounded-md border px-3 py-2 text-sm">
						{customerOptions.find((r) => r.value === $formData.cust_id)?.label ?? 'Select Customer'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Customer</Select.Label>
							{#each customerOptions as c (c.value)}
								<Select.Item value={c.value} label={c.label}>{c.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === POINT USED === -->
		<Form.Field {form} name="point_used">
			<Form.Control>
				<Form.Label>Point Used</Form.Label>
				<Input type="number" placeholder="Enter Point Used" bind:value={$formData.point_used} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === POINT EARNED === -->
		<Form.Field {form} name="point_earned">
			<Form.Control>
				<Form.Label>Point Earned</Form.Label>
				<Input type="number" placeholder="Enter Point Earned" bind:value={$formData.point_earned} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === STATUS === -->
		<Form.Field {form} name="status">
			<Form.Control>
				<Form.Label>Status</Form.Label>
				<Select.Root type="single" name="status" bind:value={statusValue}>
					<Select.Trigger class="w-full rounded-md border px-3 py-2 text-sm">
						{statusLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Status</Select.Label>
							{#each statusOptions as s (s.value)}
								<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === TOTAL AMOUNT === -->
		<Form.Field {form} name="total_amount">
			<Form.Control>
				<Form.Label>Total Amount</Form.Label>
				<Input type="number" placeholder="Enter Total Amount" bind:value={$formData.total_amount} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === FINAL AMOUNT === -->
		<Form.Field {form} name="final_amount">
			<Form.Control>
				<Form.Label>Final Amount</Form.Label>
				<Input type="number" placeholder="Enter Final Amount" bind:value={$formData.final_amount} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === DISCOUNT AMOUNT === -->
		<Form.Field {form} name="discount_amount">
			<Form.Control>
				<Form.Label>Discount Amount</Form.Label>
				<Input
					type="number"
					placeholder="Enter Discount Amount"
					bind:value={$formData.discount_amount}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- === PAYMENT METHOD === -->
		<Form.Field {form} name="payment_method">
			<Form.Control>
				<Form.Label>Payment Method</Form.Label>
				<Select.Root type="single" name="payment_method" bind:value={paymentValue}>
					<Select.Trigger class="w-full rounded-md border px-3 py-2 text-sm">
						{paymentLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Payment</Select.Label>
							{#each paymentOptions as p (p.value)}
								<Select.Item value={p.value} label={p.label}>{p.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- === ITEM DETAILS DYNAMIC === -->

	<!-- === BUTTONS === -->
	<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
		<Button
			variant="outline"
			class="w-full rounded-full sm:w-auto"
			onclick={() => goto('/purchase')}>Cancel</Button
		>
		<Button type="submit" class="w-full rounded-full sm:w-auto">Save</Button>
	</div>
</form>
