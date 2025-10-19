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

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-lg px-4 py-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-lg font-bold sm:text-xl md:text-2xl">Create Report Invoice</h2>

	<!-- INVOICE ID -->
	<Form.Field {form} name="inv_id">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Invoice <span class="text-red-500">*</span>
			</Form.Label>
			<Select.Root type="single" name="inv_id" bind:value={$formData.inv_id}>
				<Select.Trigger class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base">
					{invoiceOptions.find((r) => r.value === $formData.inv_id)?.label ?? 'Select Invoice'}
				</Select.Trigger>
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
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- DESCRIPTION -->
	<Form.Field {form} name="description" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">Description</Form.Label>
			<Input
				type="text"
				placeholder="Enter description"
				bind:value={$formData.description}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base"
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
			onclick={() => goto('/report/invoice')}
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
