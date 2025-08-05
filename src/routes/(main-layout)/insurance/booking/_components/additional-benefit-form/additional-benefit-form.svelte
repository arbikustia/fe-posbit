<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Accordion } from 'bits-ui';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { FormCard } from '../form-card';
	import type { bookingSchema } from '../page/schema';
	import AdditionalBenefitFormItem from './additional-benefit-form-item.svelte';

	type AdditionalBenefitFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: AdditionalBenefitFormProps = $props();

	const { form: formData } = form;
</script>

<FormCard title="Additional Benefit">
	<div class="space-y-1 p-4">
		<Form.Fieldset {form} name="additionalBenefits">
			<Accordion.Root type="single" class="space-y-2">
				<AdditionalBenefitFormItem />
				<AdditionalBenefitFormItem />
				<AdditionalBenefitFormItem />
			</Accordion.Root>
		</Form.Fieldset>
	</div>
</FormCard>
