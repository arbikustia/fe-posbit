<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { useTrainSort } from './train-sort.svelte.js';
	import { sortingList } from './constants.js';
	import { Check } from '@lucide/svelte';

	const { state, close } = useTrainSort();
</script>

<Drawer.Root bind:open={state.open}>
	<Drawer.Trigger
		class={cn('text-xs', {
			'text-primary': state.value !== 'price_asc'
		})}
	>
		<Icon icon="mdi:sort" class="h-7 w-7" />
		<span>Sort</span>
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
								close();
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
