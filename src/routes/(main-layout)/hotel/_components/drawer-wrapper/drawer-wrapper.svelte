<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import type { Airport } from '$lib/types/Airport';
	import type { Hotel } from '$lib/types/Hotel.js';
	import { useDrawerWrapper } from './use-drawer-wrapper.svelte.js';

	let { value = $bindable(), icon, outlet, placeholder, title } = $props();

	const { state, resetList, selectedDisplay, handleSearchDebounce, handleScroll } =
		useDrawerWrapper();

	function onSelect(item: Hotel) {
		value = item.locationName;
		state.isOpenList = false;
	}
</script>

<Drawer.Root
	bind:open={state.isOpenList}
	onOpenChange={(open) => {
		if (!open) {
			resetList();
		}
	}}
>
	<div class="mb-1 text-xs font-bold ">{title}</div>
	<Drawer.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="secondary"
				{...props}
				class="flex w-full text-primary justify-start px-4 focus-visible:ring-0"
				role="combobox"
			>
				<div class="">
					{@render icon()}
				</div>

				<div class="truncate">
					{#if value === ''}
						<span class="font-medium">{placeholder}</span>
					{:else}
						<span class="font-semibold">{value} </span>
					{/if}
				</div>
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="w-full text-start">
			<Drawer.Header>
				<Drawer.Title>{title}</Drawer.Title>
				<Drawer.Description class="w-full text-start font-medium text-md text-black"
					>Select Hotel</Drawer.Description
				>
			</Drawer.Header>
			<div class="">
				<Command.Root shouldFilter={false}>
					<Command.Input
						class="w-full"
						{placeholder}
						bind:value={state.keyword}
						oninput={handleSearchDebounce}
					/>
					<Command.List onscroll={handleScroll} class="custom-scrollbar max-h-[400px]">
						<Command.Empty>data not found.</Command.Empty>
						<Command.Group>
							{#each state.displayedItems as item}
								{@render outlet({
									locationName: item.locationName,
									countryName: item.countryName,
									type: item.type,
									onSelect: () => onSelect(item)
								})}
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
