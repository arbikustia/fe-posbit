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
	const { form: formData, enhance, errors } = form;

	// Contoh data (bisa diganti dari API)
	const itemOptions = [
		{ value: '1', label: 'Laptop Lenovo' },
		{ value: '2', label: 'Keyboard Logitech' },
		{ value: '3', label: 'Monitor LG' }
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

	let statusValue = $state('');
	let paymentValue = $state('');

	const statusLabel = $derived(statusOptions.find((r) => r.value === statusValue)?.label ?? 'Select Status');
	const paymentLabel = $derived(paymentOptions.find((r) => r.value === paymentValue)?.label ?? 'Select Payment Method');
</script>

<form method="POST" use:enhance onsubmit={handleSubmit} class="mx-auto w-full max-w-3xl py-4">
	<h2 class="mb-6 text-base font-bold">Create New Purchase</h2>

	<div class="grid grid-cols-2 gap-4">
		
		<!-- ITEM SELECT -->
		<Form.Field {form} name="item_id">
			<Form.Control >
				<Form.Label>Item</Form.Label>
				<Select.Root type="single" name="item_id" bind:value={$formData.item_id}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">
						{itemOptions.find((r) => r.value === $formData.item_id)?.label ?? 'Select Item'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Item</Select.Label>
							{#each itemOptions as i (i.value)}
								<Select.Item value={i.value} label={i.label}>{i.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- CUSTOMER SELECT -->
		<Form.Field {form} name="cust_id">
			<Form.Control>
				<Form.Label>Customer</Form.Label>
				<Select.Root type="single" name="cust_id" bind:value={$formData.cust_id}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">
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

		<!-- SISANYA SAMA -->
		<Form.Field {form} name="point_used">
			<Form.Control>
				<Form.Label>Point Used</Form.Label>
				<Input type="number" placeholder="Enter Point Used" bind:value={$formData.point_used} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="point_earned">
			<Form.Control>
				<Form.Label>Point Earned</Form.Label>
				<Input type="number" placeholder="Enter Point Earned" bind:value={$formData.point_earned} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="status">
			<Form.Control>
				<Form.Label>Status</Form.Label>
				<Select.Root type="single" name="status" bind:value={$formData.status}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">{statusLabel}</Select.Trigger>
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

		<Form.Field {form} name="total_amount">
			<Form.Control>
				<Form.Label>Total Amount</Form.Label>
				<Input type="number" placeholder="Enter Total Amount" bind:value={$formData.total_amount} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="final_amount">
			<Form.Control>
				<Form.Label>Final Amount</Form.Label>
				<Input type="number" placeholder="Enter Final Amount" bind:value={$formData.final_amount} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="discount_amount">
			<Form.Control>
				<Form.Label>Discount Amount</Form.Label>
				<Input type="number" placeholder="Enter Discount Amount" bind:value={$formData.discount_amount} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="payment_method">
			<Form.Control>
				<Form.Label>Payment Method</Form.Label>
				<Select.Root type="single" name="payment_method" bind:value={$formData.payment_method}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm">{paymentLabel}</Select.Trigger>
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

	<div class="flex justify-end gap-4 pt-6">
		<Button variant="outline" onclick={() => goto('/purchase')}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>
