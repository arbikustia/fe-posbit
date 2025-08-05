<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import z from 'zod';
	import type { bookingSchema } from '../page/schema';
	import { FormCard } from '../form-card';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import { Textarea } from '$lib/components/ui/textarea';
	import { SelectIdType } from '../select-id-type';
	import * as Form from '$lib/components/ui/form';
	import Icon from '@iconify/svelte';
	import { SelectPolicyHolderType } from '../select-policy-holder-type';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { SelectHeirRelationship } from '../select-heir-relationship';

	type PolicyHolderFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: PolicyHolderFormProps = $props();

	const { form: formData } = form;

	onMount(() => {
		$formData.policyHolder.type = 'agent';
	});
</script>

<FormCard>
	{#snippet header()}
		<div class="flex w-full items-center justify-between">
			<h2 class="text-lg">Policy Holder</h2>
			<Form.Field {form} name="policyHolder.type">
				<Form.Control>
					{#snippet children({ props })}
						<SelectPolicyHolderType {...props} bind:value={$formData.policyHolder.type} />
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>
	{/snippet}
	<div class="space-y-1 p-4">
		{#if $formData.policyHolder.type === 'traveler'}
			<div class="space-y-8">
				<OSGPrefixedInput placeholder="Search">
					{#snippet inputPrefix()}
						<Icon icon="flat-color-icons:search" width="24" height="24" />
					{/snippet}
				</OSGPrefixedInput>
				<Form.Field {form} name="policyHolder.title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Title</Form.Label>
							<OSGSalutaionSelect {...props} bind:value={$formData.policyHolder.title} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		{/if}
		<div class="grid grid-cols-2 gap-x-6">
			<div class="col-span-2 grid grid-cols-2 gap-x-6">
				<Form.Field {form} name="policyHolder.name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>
								{#if $formData.policyHolder.type === 'agent'}
									Agent Name
								{:else if $formData.policyHolder.type === 'corporate'}
									Corporate Name
								{:else}
									Full Name
								{/if}
							</Form.Label>
							<Input {...props} bind:value={$formData.policyHolder.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			{#if $formData.policyHolder.type === 'agent' || $formData.policyHolder.type === 'corporate'}
				<div class="col-span-2 grid grid-cols-2 gap-x-6">
					<Form.Field {form} name="policyHolder.phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Phone</Form.Label>
								<OSGPhoneInput {...props} bind:value={$formData.policyHolder.phone} />
							{/snippet}
						</Form.Control>
						<Form.Description>
							e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}

			{#if $formData.policyHolder.type === 'traveler'}
				<Form.Field {form} name="policyHolder.placeOfBirth">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Place Of Birth</Form.Label>
							<Input {...props} bind:value={$formData.policyHolder.placeOfBirth} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="policyHolder.dateOfBirth">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Date of Birth</Form.Label>
							<OSGSplitDatePicker {...props} bind:value={$formData.policyHolder.dateOfBirth} />
						{/snippet}
					</Form.Control>
					<Form.Description>Adult (age 12 or older)</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<div class="col-span-2 flex gap-x-4">
					<Form.Field {form} name="policyHolder.idType">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>ID Type</Form.Label>
								<SelectIdType bind:value={$formData.policyHolder.idType} {...props} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="policyHolder.idNumber" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>ID Number</Form.Label>
								<Input {...props} bind:value={$formData.policyHolder.idNumber} />
							{/snippet}
						</Form.Control>
						<Form.Description>
							For passenger below the age of 17, please user NIK from Kartu Keluarga (KK).
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="col-span-2 mb-4">
					<Separator />
				</div>

				<div class="col-span-2 mb-4 font-semibold">Policy Holder Information</div>
			{/if}
			<Form.Field {form} name="policyHolder.email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Email</Form.Label>
						<Input type="email" {...props} bind:value={$formData.policyHolder.email} />
					{/snippet}
				</Form.Control>
				<Form.Description>e.g. email@exmample.com</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			{#if $formData.policyHolder.type === 'traveler'}<Form.Field {form} name="policyHolder.phone">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Phone</Form.Label>
							<OSGPhoneInput {...props} bind:value={$formData.policyHolder.phone} />
						{/snippet}
					</Form.Control>
					<Form.Description>
						e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else}
				<Form.Field {form} name="policyHolder.additionalEmail">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Additional Email Address</Form.Label>
							<Input type="email" {...props} bind:value={$formData.policyHolder.additionalEmail} />
						{/snippet}
					</Form.Control>
					<Form.Description>e.g. email@exmample.com</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<Form.Field {form} name="policyHolder.city">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>City</Form.Label>
						<Input {...props} bind:value={$formData.policyHolder.city} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="policyHolder.postalCode">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Postal Code</Form.Label>
						<Input {...props} bind:value={$formData.policyHolder.postalCode} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="col-span-2">
				<Form.Field {form} name="policyHolder.address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Address</Form.Label>
							<Textarea {...props} bind:value={$formData.policyHolder.address} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="col-span-2 mb-4">
				<Separator />
			</div>

			<div class="col-span-2 mb-4 font-semibold">Policy Heir Information</div>

			<Form.Field {form} name="policyHolder.heirName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Heir Name</Form.Label>
						<Input {...props} bind:value={$formData.policyHolder.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="policyHolder.relationship">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Relationship</Form.Label>
						<SelectHeirRelationship bind:value={$formData.policyHolder.relationship} {...props} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
</FormCard>
