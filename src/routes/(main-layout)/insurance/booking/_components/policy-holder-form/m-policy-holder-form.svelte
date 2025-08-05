<script lang="ts">
	import { superForm, type SuperForm } from 'sveltekit-superforms';
	import z from 'zod';
	import {
		policyHolderSchemaShape,
		policyHolderSchemaSuperRefine,
		type bookingSchema
	} from '../page/schema';
	import { FormCard } from '../form-card';
	import { MOSGPhoneInput, OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import { Textarea } from '$lib/components/ui/textarea';
	import { SelectIdType } from '../select-id-type';
	import * as Form from '$lib/components/ui/form';
	import Icon from '@iconify/svelte';
	import { MSelectPolicyHolderType, SelectPolicyHolderType } from '../select-policy-holder-type';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { MSelectHeirRelationship, SelectHeirRelationship } from '../select-heir-relationship';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { ChevronRight } from '@lucide/svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import { MOSGWheelDatePicker } from '$lib/components/opsigo-ui/m-wheel-date-picker';

	type PolicyHolderFormProps = {
		parentFormData: z.infer<typeof bookingSchema>;
		isError: boolean;
	};

	let { parentFormData = $bindable(), isError }: PolicyHolderFormProps = $props();

	const form = superForm(parentFormData.policyHolder, {
		SPA: true,
		validators: zod(z.object(policyHolderSchemaShape).superRefine(policyHolderSchemaSuperRefine)),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	const isFilled = $derived.by(() => parentFormData.policyHolder?.name);

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			if (parentFormData.policyHolder) {
				parentFormData.policyHolder = {
					...parentFormData.policyHolder,
					...$formData
				};
			}
			open = false;
		} else {
			toast.error('Please check your input');
		}
	}

	let open = $state(false);

	onMount(() => {
		$formData.type = 'agent';
	});
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger type="button" class="w-full text-start">
		<div
			class={cn('bg-card w-full space-y-1 rounded-md p-2 pr-1 shadow-sm', {
				'border-destructive border': isError
			})}
		>
			<div class={cn('flex items-center justify-between')}>
				<p class="font-semibold capitalize">
					{isFilled ? parentFormData : `Fill in policy holder`}
				</p>

				<ChevronRight />
			</div>
		</div>
		{#if isError}
			<p class="text-destructive mt-2 text-sm">Please fill in policy holder</p>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content class="max-h-full border-none p-0">
		<Drawer.Header>
			<Drawer.Title class="capitalize">Policy Holder</Drawer.Title>
		</Drawer.Header>
		<form use:enhance onsubmit={handleSubmit} class="overflow-y-auto">
			<div class="px-4 pb-20 pt-2">
				<div class="mb-6">
					<Form.Field {form} name="type">
						<Form.Control>
							{#snippet children({ props })}
								<MSelectPolicyHolderType {...props} bind:value={$formData.type} />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				{#if $formData.type === 'traveler'}
					<div class="space-y-4">
						<OSGPrefixedInput placeholder="Search">
							{#snippet inputPrefix()}
								<Icon icon="flat-color-icons:search" width="24" height="24" />
							{/snippet}
						</OSGPrefixedInput>
						<Form.Field {form} name="title">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label required>Title</Form.Label>
									<OSGSalutaionSelect {...props} bind:value={$formData.title} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{/if}

				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>
								{#if $formData.type === 'agent'}
									Agent Name
								{:else if $formData.type === 'corporate'}
									Corporate Name
								{:else}
									Full Name
								{/if}
							</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				{#if $formData.type === 'agent' || $formData.type === 'corporate'}
					<Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Phone</Form.Label>
								<MOSGPhoneInput {...props} bind:value={$formData.phone} />
							{/snippet}
						</Form.Control>
						<Form.Description>
							e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				{#if $formData.type === 'traveler'}
					<Form.Field {form} name="placeOfBirth">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Place Of Birth</Form.Label>
								<Input {...props} bind:value={$formData.placeOfBirth} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="dateOfBirth">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Date of Birth</Form.Label>
								<MOSGWheelDatePicker
									title="Date of Birth"
									{...props}
									bind:value={$formData.dateOfBirth}
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>Adult (age 12 or older)</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="idType">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>ID Type</Form.Label>
								<SelectIdType bind:value={$formData.idType} {...props} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="idNumber" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>ID Number</Form.Label>
								<Input {...props} bind:value={$formData.idNumber} />
							{/snippet}
						</Form.Control>
						<Form.Description>
							For passenger below the age of 17, please user NIK from Kartu Keluarga (KK).
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<div class="mb-4">
						<Separator />
					</div>

					<div class="mb-4 font-semibold">Policy Holder Information</div>
				{/if}

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Email</Form.Label>
							<Input type="email" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description>e.g. email@exmample.com</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				{#if $formData.type === 'traveler'}
					<Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Phone</Form.Label>
								<MOSGPhoneInput {...props} bind:value={$formData.phone} />
							{/snippet}
						</Form.Control>
						<Form.Description>
							e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{:else}
					<Form.Field {form} name="additionalEmail">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Additional Email Address</Form.Label>
								<Input type="email" {...props} bind:value={$formData.additionalEmail} />
							{/snippet}
						</Form.Control>
						<Form.Description>e.g. email@exmample.com</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<Form.Field {form} name="city">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>City</Form.Label>
							<Input {...props} bind:value={$formData.city} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="postalCode">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Postal Code</Form.Label>
							<Input {...props} bind:value={$formData.postalCode} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="address">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Address</Form.Label>
							<Textarea {...props} bind:value={$formData.address} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="mb-4">
					<Separator />
				</div>

				<div class="mb-4 font-semibold">Policy Heir Information</div>

				<Form.Field {form} name="heirName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Heir Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="relationship">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Relationship</Form.Label>
							<MSelectHeirRelationship bind:value={$formData.relationship} {...props} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="absolute bottom-0 w-full border-t-2 bg-white p-4">
				<Button class="w-full" type="submit">Save</Button>
			</div>
		</form>
	</Drawer.Content>
</Drawer.Root>
