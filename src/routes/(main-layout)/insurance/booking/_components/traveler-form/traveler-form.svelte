<script lang="ts">
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
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

	const type = $formData?.travelers?.[formIdx].ageGroup;
</script>

<FormCard>
	{#snippet header()}
		<div class="flex w-full items-center justify-between">
			<h2 class="text-lg">{formIdx > 0 ? 'Traveler' : type} {formIdx + 1}</h2>
			{#if formIdx === 0}
				<Badge variant="secondary">Policy Holder</Badge>
			{/if}
		</div>
	{/snippet}

	<div class="space-y-1 p-4">
		<div class="space-y-8">
			<OSGPrefixedInput placeholder="Search">
				{#snippet inputPrefix()}
					<Icon icon="flat-color-icons:search" width="24" height="24" />
				{/snippet}
			</OSGPrefixedInput>
			<Form.Field {form} name="travelers[{formIdx}].title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Title</Form.Label>
						{#if $formData.travelers !== undefined}
							<OSGSalutaionSelect {...props} bind:value={$formData.travelers[formIdx].title} />
						{/if}
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid grid-cols-2 gap-x-6">
			<div class="col-span-2 grid grid-cols-2 gap-x-6">
				<Form.Field {form} name="travelers[{formIdx}].fullName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Full Name</Form.Label>
							{#if $formData.travelers !== undefined}
								<Input {...props} bind:value={$formData.travelers[formIdx].fullName} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Field {form} name="travelers[{formIdx}].placeOfBirth">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Place Of Birth</Form.Label>
						{#if $formData.travelers !== undefined}
							<Input {...props} bind:value={$formData.travelers[formIdx].placeOfBirth} />
						{/if}
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="travelers[{formIdx}].dateOfBirth">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Date of Birth</Form.Label>
						{#if $formData.travelers !== undefined}
							<OSGSplitDatePicker
								{...props}
								bind:value={$formData.travelers[formIdx].dateOfBirth}
							/>
						{/if}
					{/snippet}
				</Form.Control>
				<Form.Description>Adult (age 12 or older)</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<div class="col-span-2 flex gap-x-4">
				<Form.Field {form} name="travelers[{formIdx}].idType">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>ID Type</Form.Label>
							{#if $formData.travelers !== undefined}
								<SelectIdType bind:value={$formData.travelers[formIdx].idType} {...props} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="travelers[{formIdx}].idNumber" class="w-full">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>ID Number</Form.Label>
							{#if $formData.travelers !== undefined}
								<Input {...props} bind:value={$formData.travelers[formIdx].idNumber} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.Description>
						For passenger below the age of 17, please user NIK from Kartu Keluarga (KK).
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			{#if formIdx === 0}
				<div class="col-span-2 mb-4 font-semibold">Policy Holder Information</div>
				<Form.Field {form} name="travelers[{formIdx}].email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Email</Form.Label>
							{#if $formData.travelers !== undefined}
								<Input type="email" {...props} bind:value={$formData.travelers[formIdx].email} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.Description>e.g. email@exmample.com</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="travelers[{formIdx}].phone">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Phone</Form.Label>
							{#if $formData.travelers !== undefined}
								<OSGPhoneInput {...props} bind:value={$formData.travelers[formIdx].phone} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.Description>
						e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="travelers[{formIdx}].city">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>City</Form.Label>
							{#if $formData.travelers !== undefined}
								<Input {...props} bind:value={$formData.travelers[formIdx].city} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="travelers[{formIdx}].postalCode">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Postal Code</Form.Label>
							{#if $formData.travelers !== undefined}
								<Input {...props} bind:value={$formData.travelers[formIdx].postalCode} />
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="col-span-2">
					<Form.Field {form} name="travelers[{formIdx}].address">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Address</Form.Label>
								{#if $formData.travelers !== undefined}
									<Textarea {...props} bind:value={$formData.travelers[formIdx].address} />
								{/if}
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}
		</div>
	</div>
</FormCard>
