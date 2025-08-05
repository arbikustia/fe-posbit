<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Form from '$lib/components/ui/form';

	type SelectType = {
		form: any;
		label: string | null;
		value: string;
		items: any[];
		placeholder?: string;
		keyValue?: string;
		keyLabel?: string;
		name: string;
		triggerClass?: string;
	};

	let {
		form = null,
		label = null,
		value = $bindable(''),
		items = [],
		placeholder = 'All Items',
		keyValue = 'value',
		keyLabel = 'label',
		name,
		triggerClass = 'w-full'
	}: SelectType = $props();

	const triggerContent = $derived(
		items.find((f) => f[keyValue] === value)?.[keyLabel] ?? placeholder
	);

	let useValidation = form && name;
</script>

{#if useValidation}
	<Form.Field {form} {name}>
		<Form.Control>
			{#snippet children({ props })}
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				{@render SelectFieldContent({ props })}
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
{:else}
	<div class="space-y-1">
		{#if label}<label for="select-field" class="text-sm font-medium">{label}</label>{/if}
		{@render SelectFieldContent(null)}
	</div>
{/if}

{#snippet SelectFieldContent({ props }: any)}
	<Select.Root type="single" bind:value={value}>
		<Select.Trigger {...props} class={triggerClass}>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			{#each items as item (item[keyValue])}
				<Select.Item value={item[keyValue]} label={item[keyLabel]}>{item[keyLabel]}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/snippet}
