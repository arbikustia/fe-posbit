<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { bookingSchema } from '../page/schema';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import Input from '$lib/components/ui/input/input.svelte';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}
	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;

	let accordionValue = $state('item-1');
</script>

<div class="mt-10">
	<span class="font-semibold">Booking Contact</span>
	<span class="text-red-500">*</span>
</div>
<div class="mt-3 space-y-3">
	<div class="flex flex-col gap-3">
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Mr. John Doe </span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
	</div>
</div>

<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Booking Contact</Drawer.Title>
		</Drawer.Header>
		<div>
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

				<div class="flex flex-col gap-4">
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
						class="text-xs"
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
						<Form.Description class="text-xs">e.g. email@exmample.com</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
