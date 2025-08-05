<script>
	import * as Select from '$lib/components/ui/select';
	import { types } from './constants';

	let { value = $bindable(), ...props } = $props();

	const label = $derived.by(() => {
		if (value) {
			return types.find((n) => n.value === value)?.label;
		}

		return 'ID Type';
	});
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger
		class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive"
		data-fs-error={props['data-fs-error']}
	>
		<span>{label}</span>
	</Select.Trigger>
	<Select.Content align="start">
		{#each types as type}
			<Select.Item value={type.value}>
				{type.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
