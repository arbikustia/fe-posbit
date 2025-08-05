<script lang="ts">
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';

	let {
		form = null,
		name = '',
		label = '',
		items = [],
		value = $bindable(form?.form?.[name] ?? ''),
		keyLabel = 'label',
		keyValue = 'value',
		disabled = false
	} = $props();
</script>

<Form.Field {form} {name}>
	<Form.Control>
		<Label>{label || name?.charAt(0).toUpperCase() + name?.slice(1)}</Label>

		<RadioGroup bind:value class="space-y-2">
			{#each items as item}
				<div class="flex items-center space-x-2">
					<RadioGroupItem
						id={item[keyValue]}
						value={item[keyValue]}
						disabled={item.disabled ?? disabled}
					/>
					<Label for={item[keyValue]}>{item[keyLabel]}</Label>
				</div>
			{/each}
		</RadioGroup>
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
