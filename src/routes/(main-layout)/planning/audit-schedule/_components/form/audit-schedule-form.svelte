<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { auditScheduleSchema } from './schema';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import { useAuditSchedulePage } from '../../create/use-create.svelte';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	type AuditScheduleFormProps = {
		form: SuperForm<z.infer<typeof auditScheduleSchema>>;
		handleSubmit: () => void;
	};
	const { state } = useAuditSchedulePage();
	let { form, handleSubmit }: AuditScheduleFormProps = $props();

	const { form: formData, enhance, errors } = form;
</script>

<form method="POST" use:enhance onsubmit={handleSubmit}>
	<div class="container">
		<div>
			<h2 class="mb-4 flex items-center gap-3 text-base font-bold">
				Create Audit Schedule
				<!-- <span class="border border-primary bg-primary/10 px-2 rounded-md text-primary">Plan Name</span>  -->
			</h2>
			<div class="space-y-4">

				<Form.Field {form} name="name">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Schedule Name <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Input
								placeholder="Enter schedule name"
								bind:value={state.dataForm.name}
								class="pr-10 {$errors.name ? 'border-red-500 focus:border-red-500' : ''}"
							/>
						</div>
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="audit_plan_id">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Audit Plan <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.audit_plan_id}>
								<Select.Trigger
									placeholder="Select audit plan "
									class="w-full pr-10 {$errors.audit_plan_id
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.audit_plan_id !== ''
										? state.dataForm.audit_plan_id
										: 'Select audit plan'}
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

				<Form.Field {form} name="id_location_audit">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Location Audit <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_location_audit}>
								<Select.Trigger
									placeholder="Enter Location audit"
									class="w-full pr-10 {$errors.id_location_audit
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_location_audit !== ''
										? state.dataForm.id_location_audit
										: 'Select location audit'}
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

				<Form.Field {form} name="id_department_audit">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Department Audit <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_department_audit}>
								<Select.Trigger
									class="w-full pr-10 {$errors.id_department_audit
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_department_audit !== ''
										? state.dataForm.id_department_audit
										: 'Select department audit'}
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

				<Form.Field {form} name="id_auditor">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Auditor Name <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_auditor}>
								<Select.Trigger
									class="w-full pr-10 {$errors.id_auditor
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_auditor !== '' ? state.dataForm.id_auditor : 'Select auditor'}
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

				<Form.Field {form} name="id_auditee">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Auditee Name <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_auditee}>
								<Select.Trigger
									class="w-full pr-10 {$errors.id_auditee
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_auditee !== '' ? state.dataForm.id_auditee : 'Select auditee'}
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

				<Form.Field {form} name="id_auditee">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">
								Audit Template <span class="text-red-500">*</span>
							</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Select.Root type="single" bind:value={state.dataForm.id_template}>
								<Select.Trigger
									class="w-full pr-10 {$errors.id_template
										? 'border-red-500 focus:border-red-500'
										: ''}"
									>{state.dataForm.id_template !== ''
										? state.dataForm.id_template
										: 'Select template audit'}
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

				<div class="flex flex-row justify-between gap-3 p-1">
					<div id="start-date" class="w-[50%]">
						<Form.Field {form} name="start_date">
							<Form.Control>
								<div class="mb-1 flex items-center justify-between">
									<Form.Label class="text-sm font-medium text-gray-700">
										Start Date <span class="text-red-500">*</span>
									</Form.Label>
									<Form.FieldErrors class="mt-1 text-sm text-red-600" />
								</div>
								<div class="relative rounded-md border">
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
								<div class="relative rounded-md border">
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

				<Form.Field {form} name="description">
					<Form.Control>
						<div class="mb-1 flex items-center justify-between">
							<Form.Label class="text-sm font-medium text-gray-700">Description</Form.Label>
							<Form.FieldErrors class="mt-1 text-sm text-red-600" />
						</div>
						<div class="relative">
							<Textarea
								bind:value={state.dataForm.description}
								class="pr-10 {$errors.description ? 'border-red-500 focus:border-red-500' : ''}"
							/>
						</div>
					</Form.Control>
				</Form.Field>

				<!-- Buttons -->
				<div class="flex items-center justify-end gap-4 pt-2">
					<Button
						type="button"
						variant="outline"
						class="text-sm text-gray-500 hover:underline"
						onclick={() => {
							$formData.name = '';

							goto('/planning/audit-schedule');
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
