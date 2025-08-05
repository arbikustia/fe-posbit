<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { sortingList } from './constants';
	import { useTrainSort } from './train-sort.svelte.js';

	const { state, close, getSelectedValue } = useTrainSort();

	const selectedValue = $derived(getSelectedValue);
</script>

<Popover.Root bind:open={state.open}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class=" justify-between"
				{...props}
				role="combobox"
				aria-expanded={state.open}
				title="Sort"
			>
				<Icon icon="akar-icons:sort" width="24" height="24" class="mr-1 opacity-50" />
				{selectedValue() || 'Sort'}
				<ChevronDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[170px] p-0" align="end">
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
						>
							<Check class={cn(state.value !== item.value && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
