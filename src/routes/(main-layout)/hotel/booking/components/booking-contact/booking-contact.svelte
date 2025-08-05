<script lang="ts">
	import { Phone } from '$lib/components/icons';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import type { bookingSchema } from '../page/schema';

	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');
</script>

<Accordion.Root type="single" bind:value={accordionValue}>
	<Accordion.Item
		class={cn('overflow-hidden rounded-lg border-none bg-card', {
			'border shadow-sm': isAccordionOpen
		})}
		value="item-1"
	>
		<Accordion.Trigger
			class="border-b bg-primary/85 p-4 py-2 capitalize text-primary-foreground hover:no-underline [&>svg]:text-primary-foreground"
		>
			<div class="flex items-center gap-2">
				<Phone />

				<h2 class="text-lg">Booking Contact</h2>
			</div>
		</Accordion.Trigger>
		<Accordion.Content class="p-0">
			<div class="p-4">
				<OSGPrefixedInput placeholder="Search by input name, mobile phone, and employee ID">
					{#snippet inputPrefix()}
						<Icon icon="flat-color-icons:search" width="24" height="24" />
					{/snippet}
				</OSGPrefixedInput>
			</div>
			<Separator />
			<div class="space-y-4 p-4">
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<OSGSalutaionSelect {...props} bind:value={$formData.title} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="grid grid-cols-2 gap-4">
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
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
