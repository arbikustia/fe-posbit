<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import type { bookingSchema } from '../page/schema';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';

	type ContactFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: ContactFormProps = $props();

	const { form: formData } = form;
</script>

<Card.Root>
	<Card.Content>
		<div class="space-y-1">
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
							<Input {...props} bind:value={$formData.lastName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="phone">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Phone</Form.Label>
							<OSGPhoneInput {...props} bind:value={$formData.phone} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678</Form.Description
					>
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
	</Card.Content>
</Card.Root>
