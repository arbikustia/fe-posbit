<script lang="ts">
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { FormCard } from '../form-card';
	import type { bookingSchema } from '../page/schema';
	import { SelectIdType } from '../select-id-type';

	type PassengerFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
		formIdx: number;
	};

	let { form, formIdx }: PassengerFormProps = $props();

	const { form: formData } = form;

	const type = $formData.passengers[formIdx].ageGroup;
</script>

<FormCard title="Pax {formIdx + 1} ({type})">
	<div class="space-y-1 p-4">
		<div class="space-y-8">
			<OSGPrefixedInput placeholder="Search">
				{#snippet inputPrefix()}
					<Icon icon="flat-color-icons:search" width="24" height="24" />
				{/snippet}
			</OSGPrefixedInput>
			<Form.Field {form} name="passengers[{formIdx}].title">
				<Form.Control>
					{#snippet children({ props })}
						<OSGSalutaionSelect
							{...props}
							bind:value={$formData.passengers[formIdx].title}
							isAdult={type === 'adult'}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid grid-cols-2 gap-x-6">
			<Form.Field {form} name="passengers[{formIdx}].firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>First Name</Form.Label>
						<Input {...props} bind:value={$formData.passengers[formIdx].firstName} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="passengers[{formIdx}].lastName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label
							required
							class={cn({
								'opacity-50': $formData.passengers[formIdx].isSingleNameOnly
							})}>Last Name</Form.Label
						>
						<Input
							{...props}
							bind:value={$formData.passengers[formIdx].lastName}
							disabled={$formData.passengers[formIdx].isSingleNameOnly}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="col-span-2">
				<Form.Field {form} name="passengers[{formIdx}].isSingleNameOnly">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Checkbox
									{...props}
									id="single-name-check-{formIdx}"
									bind:checked={$formData.passengers[formIdx].isSingleNameOnly}
									aria-labelledby="single-name-check-{formIdx}-label"
									onCheckedChange={() => {
										$formData.passengers[formIdx].lastName = '';
									}}
								/>
								<Label
									id="single-name-check-{formIdx}-label"
									for="single-name-check-{formIdx}"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Pax {formIdx + 1} only have single word name
								</Label>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			{#if type === 'infant'}
				<div class="col-span-2 grid grid-cols-2 gap-x-6">
					<Form.Field {form} name="passengers[{formIdx}].dateOfBirth">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Date of Birth</Form.Label>
								<OSGSplitDatePicker
									{...props}
									bind:value={$formData.passengers[formIdx].dateOfBirth}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>Infant Passenger (Below 2 years old)</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}

			<Form.Field {form} name="passengers[{formIdx}].phone">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Phone</Form.Label>
						<OSGPhoneInput {...props} bind:value={$formData.passengers[formIdx].phone} />
					{/snippet}
				</Form.Control>
				<Form.Description>
					e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="passengers[{formIdx}].email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Email</Form.Label>
						<Input type="email" {...props} bind:value={$formData.passengers[formIdx].email} />
					{/snippet}
				</Form.Control>
				<Form.Description>e.g. email@exmample.com</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<div class="col-span-2 flex gap-x-4">
				<Form.Field {form} name="passengers[{formIdx}].idType">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>ID Type</Form.Label>
							<SelectIdType bind:value={$formData.passengers[formIdx].idType} {...props} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="passengers[{formIdx}].idNumber" class="w-full">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>ID Number</Form.Label>
							<Input {...props} bind:value={$formData.passengers[formIdx].idNumber} />
						{/snippet}
					</Form.Control>
					<Form.Description>
						For passenger below the age of 17, please user NIK from Kartu Keluarga (KK).
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
	</div>
</FormCard>
