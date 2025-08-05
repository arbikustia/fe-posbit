<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import type { bookingSchema } from '../page/schema';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { FormCard } from '../form-card';
	import { cn } from '$lib/utils';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	type ContactFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: ContactFormProps = $props();

	const { form: formData } = form;
</script>

<FormCard title="Booking Contact">
	<div class="space-y-1 p-4">
		<div class="space-y-8">
			<OSGPrefixedInput placeholder="Search">
				{#snippet inputPrefix()}
					<Icon icon="flat-color-icons:search" width="24" height="24" />
				{/snippet}
			</OSGPrefixedInput>
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<OSGSalutaionSelect {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid grid-cols-2 gap-x-6">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>First Name</Form.Label>
						<Input {...props} bind:value={$formData.firstName} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
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
				<Form.FieldErrors />
			</Form.Field>
			<div class="col-span-2">
				<Form.Field {form} name="isSingleNameOnly">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Checkbox
									{...props}
									id="single-name-check"
									bind:checked={$formData.isSingleNameOnly}
									aria-labelledby="single-name-check-label"
									onCheckedChange={() => {
										$formData.lastName = '';
									}}
								/>
								<Label
									id="single-name-check-label"
									for="single-name-check"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Booking Contact only have single word name
								</Label>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Field {form} name="phone">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Phone</Form.Label>
						<OSGPhoneInput {...props} bind:value={$formData.phone} />
					{/snippet}
				</Form.Control>
				<Form.Description>
					e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

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
		</div>
	</div>
</FormCard>
