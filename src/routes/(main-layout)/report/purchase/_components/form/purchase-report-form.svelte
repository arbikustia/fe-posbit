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

	const itemLabel = $derived(itemOptions.find((r) => r.value === itemValue)?.label ?? 'Select Item');
	const purchaseLabel = $derived(purchaseOptions.find((r) => r.value === purchaseValue)?.label ?? 'Select Purchase Order');
</script>

<form method="POST" use:enhance onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl py-4">
	<h2 class="mb-6 text-base font-bold">Create Purchase Data</h2>

	<div class="gap-4">
		<!-- PURCHASE ORDER -->
		<Form.Field {form} name="purchase_order_id">
			<Form.Control>
				<Form.Label>Purchase Order</Form.Label>
				<Select.Root type="single" name="purchase_order_id" bind:value={$formData.purchase_order_id}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">{purchaseLabel}</Select.Trigger>
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
			<Form.FieldErrors />
		</Form.Field>

		<!-- ITEM -->
		<Form.Field {form} name="item_id">
			<Form.Control>
				<Form.Label>Item</Form.Label>
				<Select.Root type="single" name="item_id" bind:value={$formData.item_id}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">{itemLabel}</Select.Trigger>
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

		<!-- QTY -->
		<Form.Field {form} name="qty">
			<Form.Control>
				<Form.Label>Quantity</Form.Label>
				<Input type="number" placeholder="Enter quantity" bind:value={$formData.qty} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex justify-end gap-4 pt-6">
		<Button variant="outline" onclick={() => goto('/report/purchase')}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>
