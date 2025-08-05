<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Icon from '@iconify/svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { usePreferredProviders } from './preferred-providers.svelte.js';
	import { onMount } from 'svelte';
	import type { PreferredProviderProps } from './types.js';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable(),
		triggerClass,
		showIcon = true,
		variant
	}: PreferredProviderProps = $props();

	const {
		state,
		init,
		displaySelected,
		reset,
		closeAndFocusTrigger,

		handleSelectAll
	} = usePreferredProviders();

	function setValue() {
		value = state.availableProviders.filter((item) => item.selected).map((item) => item.code);
	}

	function resetValue() {
		value = [];
	}

	// handle change by parent
	onMount(() => {
		init(value);
	});

	$effect(() => {
		state.isSelectedAll = state.availableProviders.every((item) => item.selected);
	});
</script>

<Popover.Root bind:open={state.isOpenList}>
	<Popover.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			{#if variant == 'combination'}
				<Button
					variant="ghost"
					{...props}
					bind:ref={state.triggerRef}
					class={cn(
						'bg-accent focus:outline-hidden flex h-11 w-full justify-start  px-2',
						triggerClass
					)}
					role="combobox"
				>
					<div>
						<Icon icon="mdi:airplane-cog" width="24" height="24" />
					</div>
					<div class=" truncate">{displaySelected()}</div>
					<ChevronDown class="ml-auto size-4 shrink-0" />
				</Button>
			{:else}
				<Button
					variant="ghost"
					{...props}
					class={cn(
						'text-primary hover:text-primary focus:outline-hidden flex w-full justify-start px-2 font-semibold',
						triggerClass
					)}
					role="combobox"
				>
					{#if showIcon}
						<div class="">
							<Icon icon="mdi:airplane-cog" width="24" height="24" />
						</div>
					{/if}
					<div class="text ml-1 truncate">{displaySelected()}</div>
					<ChevronDown class="text-primary/70 ml-auto size-4  shrink-0" />
				</Button>
			{/if}
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="max-h-[450px] w-[440px]" side="bottom" align="start">
		<div class="mb-5 flex items-center space-x-2">
			<Checkbox
				id="selectall"
				bind:checked={state.isSelectedAll}
				onCheckedChange={() => handleSelectAll(setValue)}
			/>
			<Label
				for="selectall"
				class="cursor-pointer   font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Select All
			</Label>
		</div>
		<div class="grid grid-cols-2 gap-4">
			{#each state.availableProviders as item}
				<div class="flex items-center">
					<Checkbox
						id={'provider_item_' + item.code}
						bind:checked={item.selected}
						onCheckedChange={setValue}
					/>
					<Label
						for={'provider_item_' + item.code}
						class="cursor-pointer pl-2 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{item.name}
					</Label>
				</div>
			{/each}
		</div>
		<div class="space-x-3 text-right">
			<Button variant="ghost" onclick={() => reset(resetValue)}>Clear</Button>

			<Button onclick={() => closeAndFocusTrigger()} class="w-[120px]">Done</Button>
		</div>
	</Popover.Content>
</Popover.Root>
