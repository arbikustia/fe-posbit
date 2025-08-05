<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Accordion } from 'bits-ui';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { FormCard } from '../form-card';
	import type { bookingSchema } from '../page/schema';
	import MAdditionalBenefitFormItem from './m-additional-benefit-form-item.svelte';

	type AdditionalBenefitFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: AdditionalBenefitFormProps = $props();

	const { form: formData } = form;
</script>

<div class="space-y-1">
	<Form.Fieldset {form} name="additionalBenefits">
		<Accordion.Root type="single" class="space-y-2">
			<MAdditionalBenefitFormItem />
			<MAdditionalBenefitFormItem />
			<MAdditionalBenefitFormItem />
		</Accordion.Root>
	</Form.Fieldset>
</div>
