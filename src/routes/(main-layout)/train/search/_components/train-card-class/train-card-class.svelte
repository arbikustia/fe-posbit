<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	const classList = [
		{
			id: '1',
			label: '2,754,000 - Economy (A)'
		},
		{
			id: '2',
			label: '3,754,000 - Executive (C)'
		}
	];

	let {
		value = $bindable()
	}: {
		value: string | undefined;
	} = $props();

	const triggerContent = $derived(classList.find((item) => item.id === value)?.label);
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger onclick={(e) => e.stopPropagation()}>
		<div class=" truncate">{triggerContent}</div>
	</Select.Trigger>
	<Select.Content align="start">
		<Select.Group>
			{#each classList as cls}
				<Select.Item value={cls.id} label={cls.label} />
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
