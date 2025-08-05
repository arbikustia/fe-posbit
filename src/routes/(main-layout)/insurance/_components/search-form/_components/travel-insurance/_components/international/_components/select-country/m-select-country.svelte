<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Check } from '@lucide/svelte';
	import { useSelectCountry } from './select-country.svelte.js';
	import { cn } from '$lib/utils.js';

	let { value = $bindable(), icon, placeholder } = $props();

	const { state, getSelectedDisplay, closeAndFocusTrigger, resetList, handleSearchDebounce } =
		useSelectCountry();

	const selectedDisplay = $derived(getSelectedDisplay(value));
</script>

<Drawer.Root
	bind:open={state.isOpenList}
	onOpenChange={(open) => {
		if (!open) {
			resetList();
		}
	}}
>
	<Drawer.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="ghost"
				{...props}
				class="flex h-8 w-full justify-start px-2 py-0"
				role="combobox"
			>
				<div class="text-muted-foreground">
					{@render icon()}
				</div>

				<div class="ml-1 truncate">
					{#if value === ''}
						<span class="text-muted-foreground font-normal">Select Station</span>
					{:else}
						<span class="font-semibold">{selectedDisplay} </span>
					{/if}
				</div>
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content class="h-3/4 p-0">
		<Drawer.Header class="text-left">
			<Drawer.Title>Select Country</Drawer.Title>
		</Drawer.Header>
		<Command.Root shouldFilter={false}>
			<Command.Input {placeholder} bind:value={state.keyword} oninput={handleSearchDebounce} />
			<!-- <Command.List onscroll={handleScroll} class="max-h-full"> -->
			<Command.List class="max-h-full">
				<Command.Empty>Country not found.</Command.Empty>
				<Command.Group>
					{#each state.displayedItems as country}
						<Command.Item
							value={country.value}
							onSelect={() => {
								value = country.value;
								closeAndFocusTrigger();
							}}
							class="cursor-pointer"
						>
							<div class="flex w-full items-center justify-between">
								{country.label}
								<Check class={cn('mr-2 size-4', value !== country.value && 'text-transparent')} />
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
