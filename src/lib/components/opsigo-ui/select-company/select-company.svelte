<script lang="ts">
	import Icon from '@iconify/svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsDown from '@lucide/svelte/icons/chevron-down';
	import { useSelectCompany } from './select-company.svelte.js';
	import type { SelectCompanyProps } from './types.js';

	let {
		value = $bindable(),
		triggerClass,
		showIcon = true,
		showSelectedCode = true
	}: SelectCompanyProps = $props();

	let {
		state,
		resetList,
		closeAndFocusTrigger,
		getSelectedDisplay,
		handleScroll,
		handleSearchDebounce
	} = useSelectCompany();

	const selectedDisplay = $derived(getSelectedDisplay(value, showSelectedCode));
</script>

<Popover.Root
	bind:open={state.isOpenList}
	onOpenChange={(open) => {
		if (!open) {
			resetList();
		}
	}}
>
	<Popover.Trigger
		bind:ref={state.triggerRef}
		class={buttonVariants({
			variant: 'ghost',
			class: cn('text-primary hover:text-primary flex w-auto justify-start px-2', triggerClass)
		})}
		role="combobox"
	>
		{#if showIcon}
			<div class="">
				<Icon icon="tabler:building" width="24" height="24" />
			</div>
		{/if}
		<div class="line-clamp-1 font-semibold">
			{#if value === ''}
				Select Company
			{:else}
				{selectedDisplay}
			{/if}
		</div>
		<ChevronsDown class="text-primary/70 ml-auto size-4  shrink-0" />
	</Popover.Trigger>
	<Popover.Content class="w-[500px] p-0" side="bottom" align="start">
		<Command.Root shouldFilter={false}>
			<Command.Input
				placeholder="Search company..."
				bind:value={state.keyword}
				oninput={handleSearchDebounce}
			/>
			<Command.List onscroll={handleScroll} class="custom-scrollbar">
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
	</Popover.Content>
</Popover.Root>
