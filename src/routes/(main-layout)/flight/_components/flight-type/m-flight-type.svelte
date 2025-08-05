<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { flightTypes } from './constants';
	import type { FlightTypeProps } from './types';

	let { value = $bindable() }: FlightTypeProps = $props();
</script>

<Tabs.Root bind:value class="w-full">
	<Tabs.List class="grid h-11 w-full grid-cols-3">
		{#each flightTypes as type}
			<Tabs.Trigger
				class="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
				value={type.value}>{type.label}</Tabs.Trigger
			>
		{/each}
	</Tabs.List>
</Tabs.Root>
