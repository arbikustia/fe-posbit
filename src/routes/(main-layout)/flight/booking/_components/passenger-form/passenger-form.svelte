<script lang="ts">
	import { OSGPhoneInput } from '$lib/components/opsigo-ui/phone-input';
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGSalutaionSelect } from '$lib/components/opsigo-ui/salutation-select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Icon from '@iconify/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { NationalitySelect } from '../nationality-select';
	import type { bookingSchema } from '../page/schema';
	import PassportForm from '../passport-form/passport-form.svelte';

	type PassengerFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
		formIdx: number;
	};

	let { form, formIdx }: PassengerFormProps = $props();

	const { form: formData } = form;

	const type = $formData.passengers[formIdx].ageGroup;

	function getDOBFormDescription() {
		if (type === 'child') {
			return 'Child Passenger (Age 2 - 12)';
		}

		if (type === 'infant') {
			return 'Infant Passenger (Below 2 years old)';
		}

		return 'Adult Passenger (Age 12 and older)';
	}
</script>

<Card.Root class="overflow-hidden py-0">
	<Card.Content class="p-0">
		<Accordion.Root type="single" value="item-1">
			<Accordion.Item class="border-none" value="item-1">
				<Accordion.Trigger class="border-b p-4 text-base capitalize hover:no-underline"
					>Pax {formIdx + 1} ({type})</Accordion.Trigger
				>
				<Accordion.Content class="p-4">
					<div class="space-y-1">
						<div class="space-y-8">
							<OSGPrefixedInput placeholder="Search">
								{#snippet inputPrefix()}
									<Icon icon="flat-color-icons:search" width="24" height="24" />
								{/snippet}
							</OSGPrefixedInput>
							<Form.Field {form} name="passengers[{formIdx}].title">
								<Form.Control>
									{#snippet children({ props })}
										<OSGSalutaionSelect
											{...props}
											bind:value={$formData.passengers[formIdx].title}
											isAdult={type === 'adult'}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div class="grid grid-cols-2 gap-x-6">
							<Form.Field {form} name="passengers[{formIdx}].firstName">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>First Name</Form.Label>
										<Input {...props} bind:value={$formData.passengers[formIdx].firstName} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="passengers[{formIdx}].lastName">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>Last Name</Form.Label>
										<Input {...props} bind:value={$formData.passengers[formIdx].lastName} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="passengers[{formIdx}].phone">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>Phone</Form.Label>
										<OSGPhoneInput {...props} bind:value={$formData.passengers[formIdx].phone} />
									{/snippet}
								</Form.Control>
								<Form.Description
									>e.g. +62812345678 for Country Code (+62) and Mobile No. 0812345678</Form.Description
								>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="passengers[{formIdx}].email">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>Email</Form.Label>
										<Input
											type="email"
											{...props}
											bind:value={$formData.passengers[formIdx].email}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>e.g. email@exmample.com</Form.Description>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="passengers[{formIdx}].dateOfBirth">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>Date of Birth</Form.Label>
										<OSGSplitDatePicker
											{...props}
											bind:value={$formData.passengers[formIdx].dateOfBirth}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>{getDOBFormDescription()}</Form.Description>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="passengers[{formIdx}].nationality">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label required>Nationality</Form.Label>
										<NationalitySelect
											bind:value={$formData.passengers[formIdx].nationality}
											{...props}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Field {form} name="passengers[{formIdx}].frequentFlyer">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Garuda Frequent Flyer</Form.Label>
										<Input {...props} bind:value={$formData.passengers[formIdx].frequentFlyer} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<PassportForm {form} {formIdx} />
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card.Content>
</Card.Root>
