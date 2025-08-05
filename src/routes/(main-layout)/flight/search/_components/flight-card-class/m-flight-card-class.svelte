<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import { Sort } from '$lib/components/icons';
	import { ChevronDown } from '@lucide/svelte';
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

	let open = $state<boolean>(false);

	const triggerContent = $derived(getTriggerContent({ value, classList }));

	function close() {
		open = false;
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		onclick={(e) => e.stopPropagation()}
		class="flex items-center gap-x-4 rounded-md border border-input px-2 py-1 text-sm shadow-xs"
	>
		{triggerContent}
		<ChevronDown class="h-4 w-4 opacity-50" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Flight Class</Drawer.Title>
		</Drawer.Header>
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each classList as item}
						<Command.Item
							value={item.uniqueId}
							onSelect={() => {
								value = item.uniqueId;
								close();
							}}
							class={cn('flex items-center justify-between aria-selected:bg-transparent', {
								'bg-accent!': value === item.uniqueId
							})}
						>
							{getLabel(item)}
							<Check class={cn(value !== item.uniqueId && 'text-transparent')} />
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
