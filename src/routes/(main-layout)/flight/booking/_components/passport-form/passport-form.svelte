<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import type { bookingSchema } from '../page/schema';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import { OSGSplitDatePicker } from '$lib/components/opsigo-ui/split-date-picker';
	import { CountryOfIssueSelect } from '../country-of-issue-select';

	export type PassportFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
		formIdx: number;
	};

	let { form, formIdx }: PassportFormProps = $props();

	const { form: formData } = form;
</script>

<div class="relative rounded-md border border-gray-300 p-4 pb-2">
	<div class="absolute -top-3 left-4 bg-white px-2">
		<span class="text-lg font-semibold">Passport Information</span>
	</div>

	<div class="mt-2 space-y-4">
		<div>
			<Form.Field {form} name="passengers[{formIdx}].passportNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Passport Number</Form.Label>
						<Input {...props} bind:value={$formData.passengers[formIdx].passportNumber} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="grid grid-cols-1 gap-x-6 md:grid-cols-2">
			<div>
				<Form.Field {form} name="passengers[{formIdx}].passportExpireDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Expire Date</Form.Label>
							<OSGSplitDatePicker
								{...props}
								bind:value={$formData.passengers[formIdx].passportExpireDate}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field {form} name="passengers[{formIdx}].passportCountryOfIssue">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label required>Country of Issue</Form.Label>
							<CountryOfIssueSelect
								bind:value={$formData.passengers[formIdx].passportCountryOfIssue}
								{...props}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
	</div>
</div>
