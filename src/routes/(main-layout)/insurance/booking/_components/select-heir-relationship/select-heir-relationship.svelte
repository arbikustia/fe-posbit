<script>
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { heirRelationships } from './constants';

	let { value = $bindable(), ...props } = $props();

	const label = $derived.by(() => {
		if (value) {
			return heirRelationships.find((n) => n.value === value)?.label;
		}

		return 'Relationship';
	});
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger
		class={cn(
			'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full'
		)}
		data-fs-error={props['data-fs-error']}
		onclick={(e) => {
			e.stopPropagation();
		}}
	>
		<span>{label}</span>
	</Select.Trigger>
	<Select.Content align="start">
		{#each heirRelationships as relationship}
			<Select.Item value={relationship.value}>
				{relationship.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
