<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { purchaseReportSchema } from './schema';
	import { goto } from '$app/navigation';

	type PurchaseFormProps = {
		form: SuperForm<z.infer<typeof purchaseReportSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: PurchaseFormProps = $props();
	const { form: formData, enhance, errors } = form;

	const itemOptions = [
		{ value: 'item1', label: 'Laptop' },
		{ value: 'item2', label: 'Monitor' },
		{ value: 'item3', label: 'Keyboard' }
	];

	const purchaseOptions = [
		{ value: 'po1', label: 'PO-001' },
		{ value: 'po2', label: 'PO-002' },
		{ value: 'po3', label: 'PO-003' }
	];

	let itemValue = $state('');
	let purchaseValue = $state('');

	const itemLabel = $derived(
		itemOptions.find((r) => r.value === itemValue)?.label ?? 'Select Item'
	);
	const purchaseLabel = $derived(
		purchaseOptions.find((r) => r.value === purchaseValue)?.label ?? 'Select Purchase Order'
	);
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-lg px-4 py-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-lg font-bold sm:text-xl md:text-2xl">Create Purchase Data</h2>

	<!-- PURCHASE ORDER -->
	<Form.Field {form} name="purchase_order_id">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Purchase Order <span class="text-red-500">*</span>
			</Form.Label>
			<Select.Root type="single" name="purchase_order_id" bind:value={$formData.purchase_order_id}>
				<Select.Trigger class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base">
					{purchaseOptions.find((r) => r.value === $formData.purchase_order_id)?.label ??
						'Select Purchase Order'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Select Purchase Order</Select.Label>
						{#each purchaseOptions as po (po.value)}
							<Select.Item value={po.value} label={po.label}>{po.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- ITEM -->
	<Form.Field {form} name="item_id" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Item <span class="text-red-500">*</span>
			</Form.Label>
			<Select.Root type="single" name="item_id" bind:value={$formData.item_id}>
				<Select.Trigger class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base">
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
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- QTY -->
	<Form.Field {form} name="qty" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Quantity <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				type="number"
				placeholder="Enter quantity"
				bind:value={$formData.qty}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.qty
					? 'border-red-500 focus:border-red-500'
					: ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- BUTTONS -->
	<div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
		<Button
			type="button"
			variant="outline"
			class="w-full rounded-full px-4 py-2 text-sm text-gray-500 hover:underline sm:w-auto"
			onclick={() => goto('/report/purchase')}
		>
			Cancel
		</Button>
		<Button
			type="submit"
			class="bg-primary hover:bg-primary-dark w-full rounded-full px-4 py-2 text-sm text-white transition sm:w-auto"
		>
			Save
		</Button>
	</div>
</form>
