<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { participantSchema, defaultFormData } from './schema';
	import * as Select from '$lib/components/ui/select/index.js';
	import { useParticipantPage } from '../../create/use-create.svelte.js';

	type ParticipantFormProps = {
		form: SuperForm<z.infer<typeof participantSchema>>;
		handleSubmit: () => void;
	};
	const { state } = useParticipantPage();
	// Initialize default values
	let { form, handleSubmit }: ParticipantFormProps = $props();

	const { form: formData, enhance, errors } = form;
	Object.assign($formData, defaultFormData);
</script>

<form method="POST" use:enhance onsubmit={handleSubmit}>
	<div class="container">
		<div>
			<h2 class="mb-4 text-base font-bold">Create Participant Data</h2>
			<div class="flex gap-4">
				<div class="relative w-full">
					<Form.Field {form} name="id_user">
						<Form.Control>
							<Form.Label class="text-sm font-medium text-gray-700">
								Participant Name <span class="text-red-500">*</span>
							</Form.Label>
							<div class="relative">
								<Select.Root type="single" bind:value={state.dataForm.id_user}>
									<Select.Trigger
										placeholder="Enter participant name"
										class="w-full pr-10 {$errors.id_user
											? 'border-red-500 focus:border-red-500'
											: ''}"
										>{state.dataForm.id_user !== ''
											? state.dataForm.id_user
											: 'Enter participant name'}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="light">Light</Select.Item>
										<Select.Item value="dark">Dark</Select.Item>
										<Select.Item value="system">System</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
						</Form.Control>
						<Form.FieldErrors class="mt-1 text-sm text-red-600" />
					</Form.Field>
				</div>
				<div class="relative w-full">
					<Form.Field {form} name="role">
						<Form.Control>
							<Form.Label class="text-sm font-medium text-gray-700">
								Role <span class="text-red-500">*</span>
							</Form.Label>
							<div class="relative">
								<Select.Root type="multiple" bind:value={state.dataForm.role}>
									<Select.Trigger
										placeholder="Enter participant name"
										class="w-full pr-10 {$errors.role ? 'border-red-500 focus:border-red-500' : ''}"
										>{state.dataForm.role.length > 0
											? state.dataForm.role
											: 'Enter participant role'}</Select.Trigger
									>
									<Select.Content>
										<Select.Item value="AUDITOR">AUDITOR</Select.Item>
										<Select.Item value="AUDITEE">AUDITEE</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
						</Form.Control>
						<Form.FieldErrors class="mt-1 text-sm text-red-600" />
					</Form.Field>
				</div>
			</div>

			<!-- Buttons -->
			<div class="flex items-center justify-end gap-4 pt-2">
				<Button
					type="button"
					variant="outline"
					class="text-sm text-gray-500 hover:underline"
					onclick={() => {
						$formData.id_user = '';
						$formData.role = [];
						goto('/master/participant');
					}}
				>
					Cancel
				</Button>
				<Button type="submit" class="px-4 py-2 text-sm">Save</Button>
			</div>
		</div>
	</div>
</form>
