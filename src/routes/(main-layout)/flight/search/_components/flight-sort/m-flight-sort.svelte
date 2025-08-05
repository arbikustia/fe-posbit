<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import { sortingList } from './constants';
	import { useFlightSort } from './flight-sort.svelte.js';
	import { Sort } from '$lib/components/icons';

	const { state, closeAndFocusTrigger } = useFlightSort();
</script>

<Drawer.Root bind:open={state.open}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={cn('flex w-full flex-col items-center justify-center text-xs', {
			'text-primary': state.value !== 'price_asc'
		})}
	>
		<Sort class="h-4 w-4" />
		Sort
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Sort</Drawer.Title>
		</Drawer.Header>
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each sortingList as item}
						<Command.Item
							value={item.value}
							onSelect={() => {
								state.value = item.value;
								closeAndFocusTrigger();
							}}
							class={cn('flex items-center justify-between aria-selected:bg-transparent', {
								'bg-accent!': state.value === item.value
							})}
						>
							{item.label}
							<Check class={cn(state.value !== item.value && 'text-transparent')} />
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
