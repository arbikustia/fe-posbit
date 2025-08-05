<!-- ProfileFormFields.svelte -->
<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Label from '$lib/components/ui/label';
	import * as Checkbox from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select/index.js';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { ProfileFormData } from '../../shema';

	type ProfileFormFieldsProps = {
		form: SuperForm<ProfileFormData>;
	};

	let { form }: ProfileFormFieldsProps = $props();
	const { form: formData } = form;

	// Country codes data
	const countryCodes = [
		{ value: '+62', label: '+62', country: 'Indonesia', icon: 'twemoji:flag-indonesia' },
		{ value: '+1', label: '+1', country: 'United States', icon: 'twemoji:flag-united-states' },
		{ value: '+44', label: '+44', country: 'United Kingdom', icon: 'twemoji:flag-united-kingdom' }
	];

	// Derived value for country code trigger content
	const countryCodeTriggerContent = $derived(() => {
		const selectedCountry = countryCodes.find((c) => c.value === $formData.countryCode);
		return selectedCountry
			? selectedCountry
			: { label: 'Select', icon: 'material-symbols:arrow-drop-down' };
	});

	// Function to handle title selection
	function selectTitle(title: 'MS' | 'MR' | 'MRS') {
		$formData.title = title;
	}
</script>

<!-- Title Section -->
<div class="mb-4">
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm font-medium text-black">
					Title<span class="text-red-500">*</span>
				</Form.Label>
				<div class="flex gap-2">
					<Button
						type="button"
						variant={$formData.title === 'MR' ? 'outline' : 'outline'}
						class="rounded-full px-5 {$formData.title === 'MR' ? 'border-blue-700 bg-blue-50' : ''}"
						onclick={() => selectTitle('MR')}
					>
						MR
					</Button>
					<Button
						type="button"
						variant={$formData.title === 'MRS' ? 'outline' : 'outline'}
						class="rounded-full px-5 {$formData.title === 'MRS'
							? 'border-blue-700 bg-blue-50'
							: ''}"
						onclick={() => selectTitle('MRS')}
					>
						MRS
					</Button>
					<Button
						type="button"
						variant={$formData.title === 'MS' ? 'outline' : 'outline'}
						class="rounded-full px-5 {$formData.title === 'MS' ? 'border-blue-700 bg-blue-50' : ''}"
						onclick={() => selectTitle('MS')}
					>
						MS
					</Button>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</div>

<!-- Name Section -->
<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
	<div>
		<Form.Field {form} name="firstName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm font-medium text-black">
						First Name<span class="text-red-500">*</span>
					</Form.Label>
					<Input
						class="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
						{...props}
						bind:value={$formData.firstName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div>
		<Form.Field {form} name="lastName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm font-medium text-black">
						Last Name<span class="text-red-500">*</span>
					</Form.Label>
					<Input
						class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm {$formData.singleWordName
							? 'cursor-not-allowed bg-gray-200'
							: 'bg-gray-50'}"
						disabled={$formData.singleWordName}
						{...props}
						bind:value={$formData.lastName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
</div>

<!-- Single Word Name Checkbox -->
<div class="mb-4 border-b-2 border-neutral-100 pb-4">
	<Form.Field {form} name="singleWordName">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox.Root
						checked={$formData.singleWordName}
						onCheckedChange={(checked) => {
							$formData.singleWordName = checked;
							// Clear last name when single word name is checked
							if (checked) {
								$formData.lastName = '';
							}
						}}
						{...props}
					/>
					<Label.Root class="text-sm text-gray-600">User only have single word name</Label.Root>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</div>

<!-- Company, Email, and Mobile Section -->
<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
	<div>
		<Form.Field {form} name="company">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm font-medium text-gray-400">Company</Form.Label>
					<div class="text-sm text-gray-600">{$formData.company}</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm font-medium text-black">
						Email Address<span class="text-red-500">*</span>
					</Form.Label>
					<Input
						type="email"
						class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
						placeholder="e.g. email@example.com"
						{...props}
						bind:value={$formData.email}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div>
		<Form.Field {form} name="mobilePhone">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm font-medium text-black">
						Mobile Phone<span class="text-red-500">*</span>
					</Form.Label>
					<div class="mt-1 flex">
						<Select.Root type="single" bind:value={$formData.countryCode} name="countryCode">
							<Select.Trigger
								class="w-24 rounded-l-md rounded-r-none border-r-0 border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
							>
								<div class="flex items-center justify-center gap-1">
									<Icon icon={countryCodeTriggerContent().icon} width="16" height="16" />
									<span class="text-xs">{countryCodeTriggerContent().label}</span>
								</div>
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each countryCodes as country (country.value)}
										<Select.Item value={country.value} label={country.label}>
											<div class="flex items-center gap-2">
												<Icon icon={country.icon} width="16" height="16" />
												<span>{country.label}</span>
												<span class="text-xs text-gray-500">{country.country}</span>
											</div>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
						<Input
							type="tel"
							class="flex-1 rounded-l-none rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
							placeholder="812345678"
							{...props}
							bind:value={$formData.mobilePhone}
						/>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
</div>
