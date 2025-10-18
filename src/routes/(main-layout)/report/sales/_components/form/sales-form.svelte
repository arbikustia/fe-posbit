<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { salesSchema } from './schema';
	import { goto } from '$app/navigation';

	type SalesFormProps = {
		form: SuperForm<z.infer<typeof salesSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: SalesFormProps = $props();
	const { form: formData, enhance, errors } = form;

	const itemOptions = [
		{ value: 'item1', label: 'Laptop' },
		{ value: 'item2', label: 'Monitor' },
		{ value: 'item3', label: 'Keyboard' }
	];

	const saleOptions = [
		{ value: 'sale1', label: 'Sale #001' },
		{ value: 'sale2', label: 'Sale #002' },
		{ value: 'sale3', label: 'Sale #003' }
	];

	let itemValue = $state('');
	let saleValue = $state('');

	const itemLabel = $derived(itemOptions.find((r) => r.value === itemValue)?.label ?? 'Select Item');
	const saleLabel = $derived(saleOptions.find((r) => r.value === saleValue)?.label ?? 'Select Sale');
</script>

<form method="POST" use:enhance onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl py-4">
	<h2 class="mb-6 text-base font-bold">Create Sales Data</h2>

	<div class=" gap-4">
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

		<!-- SALE -->
		<Form.Field {form} name="sale_id">
			<Form.Control>
				<Form.Label>Sale</Form.Label>
				<Select.Root type="single" name="sale_id" bind:value={$formData.sale_id}>
					<Select.Trigger class="rounded-md border px-3 py-2 text-sm w-full">{saleLabel}</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Sale</Select.Label>
							{#each saleOptions as s (s.value)}
								<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
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
		<Button variant="outline" onclick={() => goto('/report/sales')}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>
