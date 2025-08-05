<script lang="ts">
	import { MOSGWheelDatePicker } from '$lib/components/opsigo-ui/m-wheel-date-picker';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import type { passengerSchema } from '../page/schema';
	import { MCountryOfIssueSelect } from '../country-of-issue-select';

	type MPassportFormProps = {
		form: SuperForm<z.infer<typeof passengerSchema>>;
	};

	let { form }: MPassportFormProps = $props();

	const { form: formData } = form;
</script>

<div>
	<p class="text-lg font-semibold">Passport Information</p>

	<div class="mt-2">
		<div>
			<Form.Field {form} name="passportNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Passport Number</Form.Label>
						<Input {...props} bind:value={$formData.passportNumber} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div>
			<Form.Field {form} name="passportExpireDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Expire Date</Form.Label>
						<MOSGWheelDatePicker
							title="Expire Date"
							bind:value={$formData.passportExpireDate}
							{...props}
						/>
					{/snippet}
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div>
			<Form.Field {form} name="passportCountryOfIssue">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label required>Country of Issue</Form.Label>
						<MCountryOfIssueSelect bind:value={$formData.passportCountryOfIssue} {...props} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
</div>
