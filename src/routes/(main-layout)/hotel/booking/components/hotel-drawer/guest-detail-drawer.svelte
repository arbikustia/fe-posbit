<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import type { SuperForm } from 'sveltekit-superforms';
	import { bookingSchema } from '../page/schema';
	import type { z } from 'zod';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { Separator } from '$lib/components/ui/separator';
	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}
	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;


</script>

<div class="mt-10">
	<span class="font-semibold">Guest Details</span>
	<span class="text-red-500">*</span>
</div>
<div class="mt-3 space-y-3">
	<div class="space-x-3 font-semibold">
		<span>Room</span>
		<span class="rounded-full bg-blue-400 px-2 text-white">1</span>
	</div>
	<div class="flex flex-col gap-3">
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Mr. John Doe </span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Guest 2</span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
	</div>
</div>
<div class="mt-3 space-y-3">
	<div class="space-x-3 font-semibold">
		<span>Room</span>
		<span class="rounded-full bg-blue-400 px-2 text-white">2</span>
	</div>
	<div class="flex flex-col gap-3">
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Mr. John Doe </span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Guest 2</span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
	</div>
</div>

<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Guest Detail</Drawer.Title>
		</Drawer.Header>
		<div class="h-[80vh] overflow-auto px-2">
			{#each $formData.guests as _, i}
				<div class="mt-10 space-y-4">
					<OSGPrefixedInput placeholder="Search by input name, mobile phone, and employee ID">
						{#snippet inputPrefix()}
							<Icon icon="flat-color-icons:search" width="20" height="20" />
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

					<div class="">
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
							<Form.Description class="text-xs text-gray-500"
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
		</div>
		<button class="h-8 w-full rounded-md bg-blue-700 text-white">save</button>
	</Drawer.Content>
</Drawer.Root>
