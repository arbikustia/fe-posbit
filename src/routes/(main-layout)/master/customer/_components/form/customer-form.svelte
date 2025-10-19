<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { customerSchema } from './schema';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	type CustomerFormProps = {
		form: SuperForm<z.infer<typeof customerSchema>>;
		handleSubmit: () => void;
	};

	let { form, handleSubmit }: CustomerFormProps = $props();
	const { form: formData, enhance, errors } = form;

	// Date picker value
	let memberSinceDate = $state<DateValue | undefined>(
		$formData.member_since ? parseDate($formData.member_since) : undefined
	);
	let contentRef = $state<HTMLElement | null>(null);

	// Track previous value untuk avoid infinite loop
	let previousIsMember = $state($formData.is_member);

	$effect(() => {
		// Hanya reset jika is_member berubah dari true ke false
		if (previousIsMember === true && $formData.is_member === false) {
			$formData.member_since = null;
			$formData.member_code = null;
			memberSinceDate = undefined;
		}
		previousIsMember = $formData.is_member;
	});

	// Sync date picker dengan form data
	$effect(() => {
		if (memberSinceDate) {
			$formData.member_since = memberSinceDate.toString();
		} else if ($formData.is_member) {
			$formData.member_since = null;
		}
	});
</script>

<form
	method="POST"
	use:enhance
	onsubmit={handleSubmit}
	class="mx-auto w-full max-w-md px-4 py-4 sm:px-6 md:px-8"
>
	<h2 class="mb-6 text-lg font-bold sm:text-xl md:text-2xl">Create Customer Data</h2>

	<!-- CUSTOMER NAME -->
	<Form.Field {form} name="customer_name">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">Customer Name</Form.Label>
			<Input
				placeholder="Enter customer name"
				bind:value={$formData.customer_name}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.customer_name
					? 'border-red-500 focus:border-red-500'
					: ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- PHONE -->
	<Form.Field {form} name="phone" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">Phone</Form.Label>
			<Input
				placeholder="Enter phone number"
				bind:value={$formData.phone}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.phone
					? 'border-red-500 focus:border-red-500'
					: ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- IS MEMBER -->
	<Form.Field {form} name="is_member" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">Is Member?</Form.Label>
			<div class="flex items-center space-x-2">
				<Switch id="is_member" bind:checked={$formData.is_member} />
				<Label for="is_member" class="text-sm">{$formData.is_member ? 'Yes' : 'No'}</Label>
			</div>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- MEMBER SINCE -->
	{#if $formData.is_member}
		<Form.Field {form} name="member_since" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">Member Since</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-full justify-start text-left font-normal'
							}),
							!memberSinceDate && 'text-muted-foreground',
							$errors.member_since && 'border-red-500'
						)}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{memberSinceDate
							? df.format(memberSinceDate.toDate(getLocalTimeZone()))
							: 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={memberSinceDate} />
					</Popover.Content>
				</Popover.Root>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>

		<!-- MEMBER CODE -->
		<Form.Field {form} name="member_code" class="mt-4">
			<Form.Control>
				<Form.Label class="text-sm font-medium text-gray-700">Member Code</Form.Label>
				<Input
					placeholder="Enter member code"
					bind:value={$formData.member_code}
					class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.member_code
						? 'border-red-500 focus:border-red-500'
						: ''}"
				/>
			</Form.Control>
			<Form.FieldErrors class="mt-1 text-sm text-red-600" />
		</Form.Field>
	{/if}

	<!-- POINT -->
	<Form.Field {form} name="point" class="mt-4">
		<Form.Control>
			<Form.Label class="text-sm font-medium text-gray-700">Point</Form.Label>
			<Input
				type="number"
				bind:value={$formData.point}
				class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.point
					? 'border-red-500 focus:border-red-500'
					: ''}"
			/>
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<!-- BUTTONS -->
	<div class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
		<Button
			type="button"
			variant="outline"
			class="w-full rounded-full px-4 py-2 text-sm text-gray-500 hover:underline sm:w-auto"
			onclick={() => goto('/master/customer')}
		>
			Cancel
		</Button>
		<Button
			type="submit"
			class="bg-primary hover:bg-primary-dark w-full rounded-full px-4 py-2 text-sm text-white transition sm:w-auto"
		>
			Save
		</Button>
	</div>
</form>
