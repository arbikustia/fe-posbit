<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { categorySchema } from './schema';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	type LocationFormProps = {
		form: SuperForm<z.infer<typeof categorySchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: LocationFormProps = $props();

	const { form: formData, enhance, errors } = form;

</script>

<form method="POST" use:enhance onsubmit={handleSubmit}>
	<div class="container">
		<div>
			<h2 class="mb-4 text-base font-bold">Create Category Data</h2>
			<div class="space-y-4">
				<div class="relative">
					<Form.Field {form} name="categoryName">
						<Form.Control>
							<Form.Label class="text-sm font-medium text-gray-700">
								Category Name <span class="text-red-500">*</span>
							</Form.Label>
							<div class="relative">
								<Input
									placeholder="Enter category name"
									bind:value={$formData.categoryName}
									class="pr-10 {$errors.categoryName ? 'border-red-500 focus:border-red-500' : ''}"
								/>
							</div>
						</Form.Control>
						<Form.FieldErrors class="mt-1 text-sm text-red-600" />
					</Form.Field>
				</div>

				<!-- Buttons -->
				<div class="flex items-center justify-end gap-4 pt-2">
					<Button
						type="button"
						variant="outline"
						class="text-sm text-gray-500 hover:underline"
						onclick={() => {
							$formData.categoryName = '';
							goto('/master/category');
						}}
					>
						Cancel
					</Button>
					<Button type="submit" class="px-4 py-2 text-sm">Save</Button>
				</div>
			</div>
		</div>
	</div>
</form>
