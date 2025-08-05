<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	let {
		form = null,
		label = '',
		value = $bindable(''),
		name,
		required = false,
		placeholder
	}: {
		form: any;
		label?: string;
		value: string;
		name: string;
		required?: boolean;
		placeholder?: string;
	} = $props();
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label}<Form.Label {required}>{label}</Form.Label>{/if}
			<Input {...props} bind:value {placeholder} />
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
