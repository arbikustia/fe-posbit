<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { auditPlanSchema } from './schema';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import { useAuditPlanPage } from '../../create/use-create.svelte';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';

	type AuditPlanFormProps = {
		form: SuperForm<z.infer<typeof auditPlanSchema>>;
		handleSubmit: () => void;
	};
	const { state } = useAuditPlanPage();
	let { form, handleSubmit }: AuditPlanFormProps = $props();

	const { form: formData, enhance, errors } = form;
</script>

<form method="POST" use:enhance onsubmit={handleSubmit}>
	<div class="container">
		<div>
			<h2 class="mb-4 text-base font-bold">Create Audit Plan Data</h2>
			<div class="space-y-4">
				<div class="relative">
					<Form.Field {form} name="name">
						<Form.Control>
							<div class="mb-1 flex items-center justify-between">
								<Form.Label class="text-sm font-medium text-gray-700">
									Plan Name <span class="text-red-500">*</span>
								</Form.Label>
								<Form.FieldErrors class="mt-1 text-sm text-red-600" />
							</div>
							<div class="relative">
								<Input
									placeholder="Enter plan name"
									bind:value={state.dataForm.name}
									class="pr-10 {$errors.name ? 'border-red-500 focus:border-red-500' : ''}"
								/>
							</div>
						</Form.Control>
					</Form.Field>
				</div>

				<Form.Field {form} name="id_category">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Category <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_category}>
								<Select.Trigger
									placeholder="Enter category name"
									class="w-full pr-10 {$errors.id_category
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_category !== ''
										? state.dataForm.id_category
										: 'Enter category name'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="light">Light</Select.Item>
									<Select.Item value="dark">Dark</Select.Item>
									<Select.Item value="system">System</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="audit_purpose">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Audit Purpose <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Input
								placeholder="Enter category name"
								bind:value={$formData.audit_purpose}
								class="pr-10 {$errors.audit_purpose ? 'border-red-500 focus:border-red-500' : ''}"
							/>
						</div>
					</Form.Control>
				</Form.Field>

				<div class="flex flex-row justify-between p-1 gap-3">
					<div id="start-date" class="w-[50%]">
						<Form.Field {form} name="start_date">
							<Form.Control>
								<div class="mb-1 flex items-center justify-between">
									<Form.Label class="text-sm font-medium text-gray-700">
										Start Date <span class="text-red-500">*</span>
									</Form.Label>
									<Form.FieldErrors class="mt-1 text-sm text-red-600" />
								</div>
								<div class="relative border rounded-md">
									<OSGDatePicker bind:value={state.dataForm.date.start} />
								</div>
							</Form.Control>
						</Form.Field>
					</div>
					<div id="end-date" class="w-[50%]">
						<Form.Field {form} name="end_date">
							<Form.Control>
								<div class="mb-1 flex items-center justify-between">
									<Form.Label class="text-sm font-medium text-gray-700">
										End Date <span class="text-red-500">*</span>
									</Form.Label>
									<Form.FieldErrors class="mt-1 text-sm text-red-600" />
								</div>
								<div class="relative border rounded-md">
									<OSGDatePicker
										bind:value={state.dataForm.date.end}
										positionCalendar="end"
										minValue={state.dataForm.date?.start}
										otherDate={state.dataForm.date?.start}
									/>
								</div>
							</Form.Control>
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
							$formData.name = '';
							$formData.id_category = '';
							$formData.audit_purpose = '';
							goto('/planning/audit-plan');
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
