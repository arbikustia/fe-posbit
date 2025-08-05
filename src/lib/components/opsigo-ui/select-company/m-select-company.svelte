<script lang="ts">
	import Icon from '@iconify/svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsDown from '@lucide/svelte/icons/chevron-down';
	import { useSelectCompany } from './select-company.svelte.js';
	import type { SelectCompanyProps } from './types';

	let { value = $bindable(), triggerClass }: SelectCompanyProps = $props();

	let {
		state,
		resetList,
		closeAndFocusTrigger,
		getSelectedDisplay,
		handleScroll,
		handleSearchDebounce
	} = useSelectCompany();

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
			class: cn('flex h-11 w-full justify-between bg-accent px-2	 py-4 text-start', triggerClass)
		})}
		role="combobox"
	>
		<div class="flex items-center gap-x-2 overflow-hidden">
			<Icon icon="tabler:building" class='ml-1' width="24" height="24" />

			<div class="truncate">
				{#if value === ''}
					<span>Select Company</span>
				{:else}
					<span>{selectedDisplay}</span>
				{/if}
			</div>
		</div>
		<ChevronsDown class="ml-auto size-4 shrink-0" />
	</Drawer.Trigger>
	<Drawer.Content class="h-3/4">
		<Drawer.Header class="text-left">
			<Drawer.Title>Select Company</Drawer.Title>
		</Drawer.Header>

		<Command.Root shouldFilter={false} class="h-full">
			<Command.Input
				placeholder="Search company..."
				bind:value={state.keyword}
				oninput={handleSearchDebounce}
			/>

			<Command.List onscroll={handleScroll} class="max-h-full">
				<Command.Empty>Company not found.</Command.Empty>
				<Command.Group>
					{#each state.displayedItems as com}
						<Command.Item
							value={com.code}
							onSelect={() => {
								value = com.code;
								closeAndFocusTrigger();
							}}
							class="cursor-pointer"
						>
							<div class="flex w-full items-center justify-between">
								{com.displayLabel}
								<Check class={cn('mr-2 size-4', value !== com.code && 'text-transparent')} />
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
