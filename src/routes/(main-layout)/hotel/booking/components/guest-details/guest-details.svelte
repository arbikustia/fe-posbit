<script lang="ts">
	import { People } from '$lib/components/icons';
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
	import { bookingSchema } from '../page/schema';

	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');

	const badgeClassNumbers =
		'flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground';
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
				<People />

				<h2 class="text-lg">Guest Detail</h2>
			</div>
		</Accordion.Trigger>
		<Accordion.Content class="p-0">
			{#each $formData.guests as _, i}
				<div class="space-y-4 p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 font-semibold text-gray-900">
							<p>Room</p>
							<div class={badgeClassNumbers}>{i + 1}</div>
							<p>Guest</p>
							<div class={badgeClassNumbers}>{i + 1}</div>
						</div>
					</div>
					<OSGPrefixedInput placeholder="Search by input name, mobile phone, and employee ID">
						{#snippet inputPrefix()}
							<Icon icon="flat-color-icons:search" width="24" height="24" />
						{/snippet}
					</OSGPrefixedInput>

					<Form.Field {form} name="guests[{i}].title">
						<Form.Control>
							{#snippet children({ props })}
								<OSGSalutaionSelect {...props} bind:value={$formData.guests[i].title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="grid grid-cols-2 gap-4">
						<Form.Field {form} name="guests[{i}].firstName">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label required>First Name</Form.Label>
									<Input {...props} bind:value={$formData.guests[i].firstName} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="guests[{i}].lastName">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label required>Last Name</Form.Label>
									<Input {...props} bind:value={$formData.guests[i].lastName} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="guests[{i}].phone">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label required>Phone</Form.Label>
									<OSGPhoneInput {...props} bind:value={$formData.guests[i].phone} />
								{/snippet}
							</Form.Control>
							<Form.Description
								>e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678</Form.Description
							>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>

				{#if i < $formData.guests.length - 1}
					<Separator class="my-4" />
				{/if}
			{/each}
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
