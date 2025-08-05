<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { usePreferredProviders } from './preferred-providers.svelte.js';
	import { onMount } from 'svelte';

	let { value = $bindable() } = $props();

	const { state, init, displaySelected, reset, closeAndFocusTrigger, handleSelectAll } =
		usePreferredProviders();

	function onCheckedChange() {
		value = state.availableProviders.filter((item) => item.selected).map((item) => item.code);
	}

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
</script>

<Drawer.Root bind:open={state.isOpenList}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={buttonVariants({
			class: 'bg-accent focus:outline-hidden flex h-11 w-full justify-start  px-2',
			variant: 'ghost'
		})}
	>
		<div>
			<Icon icon="mdi:airplane-cog" width="24" height="24" />
		</div>
		<div class=" truncate">{displaySelected()}</div>
		<ChevronDown class="ml-auto size-4 shrink-0" />
	</Drawer.Trigger>
	<Drawer.Content class="h-3/4">
		<Drawer.Header class="text-start">
			<div class="flex items-center justify-between">
				<Drawer.Title>Select Providers</Drawer.Title>
				<div class="flex items-center space-x-2">
					<Button
						variant="link"
						class="h-fit p-0 hover:no-underline"
						onclick={() => {
							handleSelectAll(setValue);
						}}>Select All</Button
					>
				</div>
			</div>
		</Drawer.Header>
		<div class="relative overflow-y-auto p-4 pb-16">
			<div class="space-y-4">
				{#each state.availableProviders as item}
					<div class="flex items-center justify-between">
						<Label
							for={'provider_item_' + item.code}
							class="flex-1 cursor-pointer text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{item.name}
						</Label>
						<Checkbox
							id={'provider_item_' + item.code}
							bind:checked={item.selected}
							{onCheckedChange}
						/>
					</div>
				{/each}
			</div>
			<div class="fixed bottom-0 left-0 right-0 flex space-x-3 bg-white p-2">
				<Button class="flex-1" variant="outline" onclick={() => reset(resetValue)}>Clear</Button>

				<Button class="flex-1" onclick={() => closeAndFocusTrigger()}>Done</Button>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
