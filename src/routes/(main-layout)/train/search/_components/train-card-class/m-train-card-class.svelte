<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';

	import { ChevronDown } from '@lucide/svelte';

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

	let open = $state(false);

	const triggerContent = $derived(classList.find((item) => item.id === value)?.label);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		class="flex w-36 items-center gap-x-4 rounded-md border border-input px-2 py-1 text-xs shadow-xs"
	>
		<div>
			{triggerContent}
		</div>
		<ChevronDown class="h-4 w-4 opacity-50" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Train Class</Drawer.Title>
		</Drawer.Header>
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each classList as item}
						<Command.Item
							value={item.id}
							onSelect={() => {
								value = item.id;
								close();
							}}
							class={cn('flex items-center justify-between aria-selected:bg-transparent', {
								'bg-accent!': value === item.id
							})}
						>
							{item.label}
							<Check class={cn(value !== item.id && 'text-transparent')} />
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
