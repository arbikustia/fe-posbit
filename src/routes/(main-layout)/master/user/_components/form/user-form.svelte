<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { userSchema } from './schema';
	import { goto } from '$app/navigation';
	import { BITCard } from '@/components/opsigo-ui/card';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	type UserFormProps = {
		form: SuperForm<z.infer<typeof userSchema>>;
		handleSubmit: () => void;
	};

	let isEditing = $state(false);

	let { form, handleSubmit }: UserFormProps = $props();
	const { form: formData, enhance, errors } = form;

	const roleOptions = [
		{ value: 'Admin', label: 'Admin' },
		{ value: 'Cashier', label: 'Cashier' }
	];

	let value = $state('');
	const triggerContent = $derived(
		roleOptions.find((r) => r.value === value)?.label ?? 'Select role'
	);

	onMount(() => {
		const url = get(page).url;
		const qp = url.searchParams;
		const hasAny =
			qp.has('username') || qp.has('email') || qp.has('role') || qp.has('id') || qp.has('password');

		isEditing = hasAny;
		console.log(hasAny, 'hs');
	});
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="container mx-auto w-full px-4 py-4 sm:px-6 md:px-8"
>
	<BITCard title="Create User Data">
		<!-- USERNAME -->
		<Form.Field {form} name="userName">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					User Name <span class="text-red-500">*</span>
				</Form.Label>
				<Input
					placeholder="Enter user name"
					bind:value={$formData.userName}
					class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.userName
						? 'border-red-500 focus:border-red-500'
						: ''}"
				/>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- EMAIL -->
		<Form.Field {form} name="email" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					Email <span class="text-red-500">*</span>
				</Form.Label>
				<Input
					type="email"
					placeholder="Enter email address"
					bind:value={$formData.email}
					class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.email
						? 'border-red-500 focus:border-red-500'
						: ''}"
				/>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- PASSWORD -->
		{#if !isEditing}
			<Form.Field {form} name="password" class="mt-4">
				<Form.Control>
					<Form.Label class="text-sm font-medium text-gray-700">
						Password <span class="text-red-500">*</span>
					</Form.Label>
					<Input
						type="password"
						placeholder="Enter password"
						bind:value={$formData.password}
						class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.password
							? 'border-red-500 focus:border-red-500'
							: ''}"
					/>
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-600" />
			</Form.Field>
		{/if}

		<!-- ROLE -->
		<Form.Field {form} name="role" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					Role <span class="text-red-500">*</span>
				</Form.Label>
				<Select.Root type="single" bind:value={$formData.role}>
					<Select.Trigger
						class="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none sm:text-base"
					>
						{#if $formData.role}
							{$formData.role}
						{:else}
							<span class="text-gray-400">Select role</span>
						{/if}
					</Select.Trigger>

					<Select.Content class="rounded-md border bg-white shadow-md">
						{#each roleOptions as opt}
							<Select.Item
								value={opt.value}
								class="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
							>
								{opt.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- BUTTONS -->
		<div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
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
				class="bg-primary hover:bg-primary-dark w-full rounded-full px-4 py-2 text-sm text-white transition sm:w-auto"
			>
				Save
			</Button>
		</div>
	</BITCard>
</form>
