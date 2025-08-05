<script lang="ts">
	import Icon from '@iconify/svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import { useSelectTrip } from './select-trip.svelte.ts';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let { value = $bindable(), triggerClass }: any = $props();

	let { state, resetList, closeAndFocusTrigger, getSelectedDisplay, handleSearchDebounce } =
		useSelectTrip();

	const selectedDisplay = $derived(getSelectedDisplay(value));
</script>

<Drawer.Root
	bind:open={state.isOpenList}
	onOpenChange={(open) => {
		if (!open) {
			resetList();
		}
	}}
	shouldScaleBackground={false}
>
	<Drawer.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class: cn('h-10 px-2 py-4', triggerClass)
		})}
		role="combobox"
	>
		<div class="flex items-center gap-2">
			<div class="text-primary">
				<Icon icon="iconamoon:shield-yes-bold" width="24" height="24" />
			</div>
			<div class="text-primary text-sm font-medium">
				{selectedDisplay || 'Type Trip'}
			</div>
		</div>
		<ChevronDown class="text-primary/70 ml-2 size-4 shrink-0" />
	</Drawer.Trigger>
	<Drawer.Content class="h-3/6">
		<Drawer.Header class="text-left">
			<Drawer.Title>Select Type</Drawer.Title>
		</Drawer.Header>

		<Command.Root shouldFilter={false} class="h-full">
			<Command.List class="max-h-full">
				<Command.Empty>Data not found.</Command.Empty>
				<Command.Group>
					{#each state.displayedItems as com}
						<Command.Item
							value={com.value}
							onSelect={() => {
								value = com.value;
								closeAndFocusTrigger();
							}}
							class="cursor-pointer"
						>
							<div class="flex w-full items-center justify-between">
								{com.label}
								<Check class={cn('mr-2 size-4', value !== com.value && 'text-transparent')} />
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
