<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Form from '$lib/components/ui/form';
	import { z } from 'zod';
	import { travelerSchema, travelerSchemaShape, type bookingSchema } from '../page/schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { cn } from '$lib/utils';
	import { ChevronRight } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import Icon from '@iconify/svelte';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { Input } from '$lib/components/ui/input';
	import { MOSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { MSelectIdType } from '../select-id-type';
	import { MOSGWheelDatePicker } from '$lib/components/opsigo-ui/m-wheel-date-picker';
	import { Textarea } from '$lib/components/ui/textarea';

	type MTravelerFormProps = {
		parentFormData: z.infer<typeof bookingSchema>;
		isError: boolean;
		formIdx: number;
	};

	let { parentFormData = $bindable(), formIdx, isError }: MTravelerFormProps = $props();

	let open = $state(false);

	const form = superForm(parentFormData.travelers![formIdx], {
		SPA: true,
		validators: zod(formIdx === 0 ? travelerSchema.items[0] : z.object(travelerSchemaShape)),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	const type = $derived(parentFormData?.travelers?.[formIdx].ageGroup);

	const isFilled = $derived.by(() => parentFormData.travelers?.[formIdx]?.fullName);

	async function handleSubmit(parentFormIdx: number) {
		var result = await validateForm({ update: true });
		if (result.valid) {
			if (parentFormData.travelers) {
				parentFormData.travelers[parentFormIdx] = {
					...parentFormData.travelers[parentFormIdx],
					...$formData
				};
			}
			open = false;
		} else {
			toast.error('Please check your input');
		}
	}

	$inspect($formData, 'form data');
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger type="button" class="w-full text-start">
		<div
			class={cn('bg-card w-full space-y-1 rounded-md p-2 pr-1 shadow-sm', {
				'border-destructive border': isError
			})}
		>
			<div
				class={cn('flex items-center justify-between', {
					'text-blue-500': !isFilled
				})}
			>
				<p class="font-semibold capitalize">
					{`${isFilled ? parentFormData.travelers?.[formIdx].fullName : `Traveler ${formIdx + 1}`} ${formIdx === 0 ? '(Policy Holder)' : ''}`}
				</p>

				<ChevronRight />
			</div>
		</div>
		{#if isError}
			<p class="text-destructive mt-2 text-sm">Please fill in traveler detail</p>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content class="max-h-full border-none p-0">
		<Drawer.Header>
			<Drawer.Title class="capitalize">Traveler {formIdx + 1}</Drawer.Title>
		</Drawer.Header>
		<form use:enhance onsubmit={() => handleSubmit(formIdx)} class="overflow-y-auto">
			<div class="px-4 pb-20 pt-2">
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

				<Form.Field {form} name="fullName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Full Name</Form.Label>

							<Input {...props} bind:value={$formData.fullName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>
				<Form.Field {form} name="placeOfBirth">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Place Of Birth</Form.Label>
							<Input {...props} bind:value={$formData.placeOfBirth} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>

				<Form.Field {form} name="dateOfBirth">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Date of Birth</Form.Label>

							<MOSGWheelDatePicker
								{...props}
								title="Date of Birth"
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

							<MSelectIdType bind:value={$formData.idType} {...props} />
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

				{#if formIdx === 0 && 'phone' in $formData}
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Email Address</Form.Label>
								<Input type="email" {...props} bind:value={$formData.email} />
							{/snippet}
						</Form.Control>
						<Form.Description>e.g. email@exmample.com</Form.Description>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>

					<Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Mobile Phone</Form.Label>
								<MOSGPhoneInput {...props} bind:value={$formData.phone} />
							{/snippet}
						</Form.Control>
						<Form.Description
							>e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678</Form.Description
						>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>
					<Form.Field {form} name="city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>City</Form.Label>
								<Input {...props} bind:value={$formData.city} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>
					<Form.Field {form} name="postalCode">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Postal Code</Form.Label>
								<Input {...props} bind:value={$formData.postalCode} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>

					<Form.Field {form} name="address">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Address</Form.Label>
								<Textarea {...props} bind:value={$formData.address} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>
				{/if}
			</div>
			<div class="absolute bottom-0 w-full border-t-2 bg-white p-4">
				<Button class="w-full" type="submit">Save</Button>
			</div>
		</form>
	</Drawer.Content>
</Drawer.Root>
