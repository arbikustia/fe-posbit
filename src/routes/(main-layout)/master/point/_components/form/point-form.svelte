<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from "$lib/components/ui/label/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { pointSchema } from './schema';
	import { goto } from '$app/navigation';

	type PointFormProps = {
		form: SuperForm<z.infer<typeof pointSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: PointFormProps = $props();
	const { form: formData, enhance, errors } = form;
</script>

<form method="POST" use:enhance onsubmit={handleSubmit} class="mx-auto w-full max-w-md py-4">
	<h2 class="mb-6 text-base font-bold">Create Point Data</h2>

	<!-- POINT PER VALUE -->
	<Form.Field {form} name="pointPerValue">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Amount per Point <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				placeholder="Enter amount per point"
				bind:value={$formData.pointPerValue}
				class="mt-1 w-full pr-10 { $errors.pointPerValue ? 'border-red-500 focus:border-red-500' : '' }"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- POINT VALUE -->
	<Form.Field {form} name="pointValue" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Point Value <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				type="text"
				placeholder="Enter point value"
				bind:value={$formData.pointValue}
				class="mt-1 w-full pr-10 { $errors.pointValue ? 'border-red-500 focus:border-red-500' : '' }"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- STATUS -->
	<Form.Field {form} name="status" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Status <span class="text-red-500">*</span>
			</Form.Label>
			<div class="flex items-center space-x-2">
				<Switch id="status" bind:checked={$formData.status} />
				<Label for="status">Active</Label>
			</div>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- BUTTONS -->
	<div class="flex items-center justify-end gap-4 pt-6">
		<Button
			type="button"
			variant="outline"
			class="text-sm text-gray-500 hover:underline"
			onclick={() => goto('/master/point')}
		>
			Cancel
		</Button>
		<Button type="submit" class="px-4 py-2 text-sm">Save</Button>
	</div>
</form>
