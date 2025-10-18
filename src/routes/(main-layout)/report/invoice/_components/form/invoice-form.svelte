<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { invoiceSchema } from './schema';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';

	type InvoiceFormProps = {
		form: SuperForm<z.infer<typeof invoiceSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: InvoiceFormProps = $props();
	const { form: formData, enhance, errors } = form;

	const invoiceOptions = [
		{ value: 'INV001', label: 'Invoice #001' },
		{ value: 'INV002', label: 'Invoice #002' },
		{ value: 'INV003', label: 'Invoice #003' }
	];

	let invoiceValue = $state('');
	const invoiceLabel = $derived(
		invoiceOptions.find((r) => r.value === invoiceValue)?.label ?? 'Select Invoice'
	);
</script>

<form method="POST" use:enhance onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl py-4">
	<h2 class="mb-6 text-base font-bold">Create Report Invoice</h2>

	<div class="gap-4">
		<!-- Invoice ID -->
		<Form.Field {form} name="inv_id">
			<Form.Control>
				<Form.Label>Invoice</Form.Label>
				<Select.Root type="single" name="item_id" bind:value={$formData.inv_id}>
					<Select.Trigger class="w-full rounded-md border px-3 py-2 text-sm"
						>Select Invoice</Select.Trigger
					>
					<Select.Content>
						<Select.Group>
							<Select.Label>Select Invoice</Select.Label>
							{#each invoiceOptions as i (i.value)}
								<Select.Item value={i.value} label={i.label}>{i.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Description -->
		<Form.Field {form} name="description">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Input type="text" placeholder="Enter description" bind:value={$formData.description} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="flex justify-end gap-4 pt-6">
		<Button variant="outline" onclick={() => goto('/report/invoice')}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>
