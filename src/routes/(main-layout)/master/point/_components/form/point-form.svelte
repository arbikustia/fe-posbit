<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { pointSchema } from './schema';
	import { goto } from '$app/navigation';
	import { BITCard } from '@/components/opsigo-ui/card';

	type PointFormProps = {
		form: SuperForm<z.infer<typeof pointSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: PointFormProps = $props();
	const { form: formData, enhance, errors } = form;
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full container px-4 py-4 sm:px-6 md:px-8"
>
	<BITCard title="Create Point Data">
		<!-- AMOUNT PER POINT -->
		<Form.Field {form} name="amount_per_point">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					Amount per Point <span class="text-red-500">*</span>
				</Form.Label>
				<Input
					type="number"
					placeholder="Enter amount per point"
					bind:value={$formData.amount_per_point}
					class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.amount_per_point
						? 'border-red-500 focus:border-red-500'
						: ''}"
					min="0"
					step="1"
				/>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- POINT VALUE -->
		<Form.Field {form} name="point_value" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					Point Value <span class="text-red-500">*</span>
				</Form.Label>
				<Input
					type="number"
					placeholder="Enter point value"
					bind:value={$formData.point_value}
					class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.point_value
						? 'border-red-500 focus:border-red-500'
						: ''}"
					min="0"
					step="1"
				/>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- IS ACTIVE -->
		<Form.Field {form} name="is_active" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">
					Status <span class="text-red-500">*</span>
				</Form.Label>
				<div class="flex items-center space-x-2">
					<Switch id="is_active" bind:checked={$formData.is_active} />
					<Label for="is_active">Active</Label>
				</div>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- BUTTONS -->
		<div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
			<Button
				type="button"
				variant="outline"
				class="w-full rounded-full px-4 py-2 text-sm text-gray-500 hover:underline sm:w-auto"
				onclick={() => goto('/master/point')}
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
