<script>
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { types } from './constants';

	let { value = $bindable(), ...props } = $props();

	const label = $derived.by(() => {
		if (value) {
			return types.find((n) => n.value === value)?.label;
		}

		return 'Policy Holder Type';
	});
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger
		class={cn(
			'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive text-gray-700',
			buttonVariants({ variant: 'outline' })
		)}
		data-fs-error={props['data-fs-error']}
		onclick={(e) => {
			e.stopPropagation();
		}}
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
