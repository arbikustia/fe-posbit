<script lang="ts">
	import Icon from '@iconify/svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import { useSelectGroupType } from './select-group-type.svelte.ts';

	let { value = $bindable(), triggerClass }: any = $props();

	let { state, resetList, closeAndFocusTrigger, getSelectedDisplay, handleSearchDebounce } =
		useSelectGroupType();

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
		bind:ref={state.triggerRef}
		class={buttonVariants({
			variant: 'ghost',
			class: 'block h-fit w-full px-0 text-start'
		})}
	>
		<p class="text-xs font-normal text-gray-500 mb-1">Type</p>
		<div class="flex justify-start gap-2">
			<div>
				<Icon icon="cuida:user-outline" class="text-primary" width="24" height="24" />
			</div>
			<div class="text truncate">{selectedDisplay}</div>
		</div>
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
