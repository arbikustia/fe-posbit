<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { userSchema } from './schema';
	import { goto } from '$app/navigation';

	type UserFormProps = {
		form: SuperForm<z.infer<typeof userSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: UserFormProps = $props();
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
	class="mx-auto w-full max-w-lg py-4 px-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-lg font-bold sm:text-xl md:text-2xl">Create User Data</h2>

	<!-- USERNAME -->
	<Form.Field {form} name="userName">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				User Name <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				placeholder="Enter user name"
				bind:value={$formData.userName}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.userName ? 'border-red-500 focus:border-red-500' : ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- PASSWORD -->
	<Form.Field {form} name="password" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Password <span class="text-red-500">*</span>
			</Form.Label>
			<Input
				type="password"
				placeholder="Enter password"
				bind:value={$formData.password}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.password ? 'border-red-500 focus:border-red-500' : ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- ROLE -->
	<Form.Field {form} name="role" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">
				Role <span class="text-red-500">*</span>
			</Form.Label>
			<Select.Root type="single" name="role" bind:value={$formData.role}>
				<Select.Trigger class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Select Role</Select.Label>
						{#each roleOptions as role (role.value)}
							<Select.Item value={role.value} label={role.label}>
								{role.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- BUTTONS -->
	<div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end sm:items-center">
		<Button
			type="button"
			variant="outline"
			class="w-full rounded-full px-4 py-2 text-sm text-gray-500 hover:underline sm:w-auto"
			onclick={() => goto('/master/user')}
		>
			Cancel
		</Button>
		<Button
			type="submit"
			class="w-full rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary-dark sm:w-auto"
		>
			Save
		</Button>
	</div>
</form>
