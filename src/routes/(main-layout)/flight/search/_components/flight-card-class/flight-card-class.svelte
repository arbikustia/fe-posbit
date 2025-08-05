<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { FlightClass } from '$lib/types/FlightResponse';
	import { useFlightCardClass } from './flight-card-class.svelte.js';

	let {
		value = $bindable(),
		classList
	}: {
		value: string | undefined;
		classList: FlightClass[];
	} = $props();

	const { getTriggerContent, getLabel } = useFlightCardClass();

	const triggerContent = $derived(getTriggerContent({ value, classList }));
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-[150px]" onclick={(e) => e.stopPropagation()}>
		<div class=" truncate">{triggerContent}</div>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each classList as cls}
				<Select.Item value={cls.uniqueId} label={getLabel(cls)} />
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
