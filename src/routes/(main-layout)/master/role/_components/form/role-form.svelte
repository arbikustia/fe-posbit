<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { roleSchema } from './schema';
	import { goto } from '$app/navigation';

	type RoleFormProps = {
		form: SuperForm<z.infer<typeof roleSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: RoleFormProps = $props();
	const { form: formData, enhance, errors } = form;

	const roleOptions = [
		{ value: 'admin', label: 'Admin' },
		{ value: 'cashier', label: 'Cashier' },
		{ value: 'manager', label: 'Manager' }
	];

	let value = $state('');
	const triggerContent = $derived(
		roleOptions.find((r) => r.value === value)?.label ?? 'Select role'
	);
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-lg px-4 py-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-lg font-bold sm:text-xl md:text-2xl">Create Role Data</h2>

	<!-- USERNAME -->
	<Form.Field {form} name="role">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Role <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				placeholder="Enter role name"
				bind:value={$formData.role}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.role
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
			onclick={() => goto('/master/role')}
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
