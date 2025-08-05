<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Form from '$lib/components/ui/form';
	import { z } from 'zod';
	import { passengerSchema, type bookingSchema } from '../page/schema';
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

	type MPassengerFormProps = {
		parentFormData: z.infer<typeof bookingSchema>;
		isError: boolean;
		formIdx: number;
	};

	let { parentFormData = $bindable(), formIdx, isError }: MPassengerFormProps = $props();

	let open = $state(false);

	const form = superForm(parentFormData.passengers[formIdx], {
		SPA: true,
		validators: zod(passengerSchema),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	const type = $derived(parentFormData.passengers[formIdx].ageGroup);

	const isFilled = $derived.by(
		() =>
			parentFormData.passengers[formIdx].firstName && parentFormData.passengers[formIdx].lastName
	);

	async function handleSubmit(parentFormIdx: number) {
		var result = await validateForm({ update: true });
		if (result.valid) {
			parentFormData.passengers[parentFormIdx] = {
				...parentFormData.passengers[parentFormIdx],
				...$formData
			};
			open = false;
		} else {
			toast.error('Please check your input');
		}
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger type="button" class="w-full text-start">
		<div
			class={cn('w-full space-y-1 rounded-md bg-card p-2 pr-1 shadow-sm', {
				'border border-destructive': isError
			})}
		>
			<div
				class={cn('flex items-center justify-between', {
					'text-blue-500': !isFilled
				})}
			>
				<p class="font-semibold capitalize">
					{isFilled
						? parentFormData.passengers[formIdx].firstName +
							' ' +
							parentFormData.passengers[formIdx].lastName
						: `Pax ${formIdx + 1} (${parentFormData.passengers[formIdx].ageGroup})`}
				</p>

				<ChevronRight />
			</div>
		</div>
		{#if isError}
			<p class="mt-2 text-sm text-destructive">Please fill in passenger detail</p>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content class="max-h-full border-none p-0">
		<Drawer.Header>
			<Drawer.Title class="capitalize"
				>Passenger {formIdx + 1} ({parentFormData.passengers[formIdx].ageGroup})</Drawer.Title
			>
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
								<OSGSalutaionSelect
									{...props}
									bind:value={$formData.title}
									isAdult={type === 'adult'}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<Form.Field {form} name="firstName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>First Name</Form.Label>
							<Input {...props} bind:value={$formData.firstName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>
				<Form.Field {form} name="lastName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Last Name</Form.Label>
							<Input
								{...props}
								bind:value={$formData.lastName}
								disabled={$formData.isSingleNameOnly}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>

				<Form.Field {form} name="isSingleNameOnly">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Checkbox
									{...props}
									id="single-name-check-{formIdx}"
									bind:checked={$formData.isSingleNameOnly}
									aria-labelledby="single-name-check-{formIdx}-label"
									onCheckedChange={() => {
										$formData.lastName = '';
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

				<Form.Field {form} name="phone">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Phone</Form.Label>
							<MOSGPhoneInput {...props} bind:value={$formData.phone} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678</Form.Description
					>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Email</Form.Label>
							<Input type="email" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description>e.g. email@exmample.com</Form.Description>
					<Form.FieldErrors class="min-h-2" />
				</Form.Field>

				{#if type === 'infant'}
					<Form.Field {form} name="dateOfBirth">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label required>Date of Birth</Form.Label>
								<OSGSplitDatePicker {...props} bind:value={$formData.dateOfBirth} />
							{/snippet}
						</Form.Control>
						<Form.Description>Infant Passenger (Below 2 years old)</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

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
			</div>
			<div class="absolute bottom-0 w-full border-t-2 bg-white p-4">
				<Button class="w-full" type="submit">Save</Button>
			</div>
		</form>
	</Drawer.Content>
</Drawer.Root>
