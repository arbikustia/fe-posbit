<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { bookingSchema } from '../page/schema';
	import { toast } from 'svelte-sonner';
	import { MOSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import type { z } from 'zod';
	import { ChevronDown, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import SalutationSelect from '$lib/components/opsigo-ui/salutation-select/salutation-select.svelte';

	const contactFormSchema = bookingSchema.pick({
		title: true,
		firstName: true,
		lastName: true,
		email: true,
		phone: true
	});

	type MContactFormProps = {
		parentFormData: z.infer<typeof bookingSchema>;
		isError: boolean;
	};

	let { parentFormData = $bindable(), isError }: MContactFormProps = $props();

	let open = $state(false);

	const form = superForm(defaults(zod(contactFormSchema)), {
		SPA: true,
		validators: zod(contactFormSchema),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			parentFormData = { ...parentFormData, ...$formData };
			open = false;
		} else {
			toast.error('Please check your input');
			console.log($errors, 'errors');
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
			<div class="flex items-center justify-between">
				<p class="font-semibold">
					{parentFormData.firstName && parentFormData.lastName
						? parentFormData.firstName + ' ' + parentFormData.lastName
						: 'Fill in booking contact'}
				</p>

				<ChevronRight />
			</div>

			{#if parentFormData.phone}
				<p class="text-sm">{parentFormData.phone.replace(' ', '')}</p>
			{/if}
			{#if parentFormData.email}
				<p class="text-sm">{parentFormData.email}</p>
			{/if}
		</div>
		{#if isError}
			<p class="mt-2 text-sm text-destructive">Please fill in booking contact</p>
		{/if}
	</Drawer.Trigger>
	<Drawer.Content class="max-h-screen border-none p-0">
		<Drawer.Header>
			<Drawer.Title>Booking Contact</Drawer.Title>
		</Drawer.Header>
		<form use:enhance onsubmit={handleSubmit} class="overflow-y-auto">
			<div class="px-4 pt-2">
				<div class="space-y-4">
					<OSGPrefixedInput placeholder="Search">
						{#snippet inputPrefix()}
							<Icon icon="flat-color-icons:search" width="24" height="24" />
						{/snippet}
					</OSGPrefixedInput>
					<Form.Field {form} name="title">
						<Form.Control>
							{#snippet children({ props })}
								<SalutationSelect {...props} bind:value={$formData.title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="min-h-2" />
					</Form.Field>
				</div>
				<div>
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
								<Input {...props} bind:value={$formData.lastName} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="min-h-2" />
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
				</div>
			</div>
			<div class="border-t-2 bg-white p-4">
				<Button class="w-full" type="submit">Save</Button>
			</div>
		</form>
	</Drawer.Content>
</Drawer.Root>
