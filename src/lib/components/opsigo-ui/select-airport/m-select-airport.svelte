<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import type { Airport } from '$lib/types/Airport';
	import { useSelectAirport } from './select-airport.svelte.js';
	import SelectAirportItem from './select-airport-item.svelte';

	let { value = $bindable(), icon, placeholder } = $props();

	const { state, getSelectedAirportDisplay, handleScroll, resetList, handleSearchDebounce } =
		useSelectAirport();

	const selectedAirportDisplay = $derived(getSelectedAirportDisplay(value));

	function onSelect(selected: Airport) {
		value = selected.airportCode;
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
	<Drawer.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			<Button variant="ghost" {...props} class="flex w-full justify-start px-2" role="combobox">
				<div class="text-muted-foreground">
					{@render icon()}
				</div>

				<div class="ml-1 truncate">
					{#if value === ''}
						<span class="font-normal text-muted-foreground">Select Airport</span>
					{:else}
						<span class="font-semibold">{selectedAirportDisplay} </span>
					{/if}
				</div>
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content class="h-3/4 p-0">
		<Drawer.Header class="text-left">
			<Drawer.Title>Select Airport</Drawer.Title>
		</Drawer.Header>
		<Command.Root shouldFilter={false}>
			<Command.Input {placeholder} bind:value={state.keyword} oninput={handleSearchDebounce} />
			<Command.List onscroll={handleScroll} class="max-h-full">
				<Command.Empty>Airport not found.</Command.Empty>
				<Command.Group>
					{#each state.displayedAirports as { parent, children }}
						{#if parent}
							<SelectAirportItem
								selected={value}
								airport={parent}
								onSelect={() => {
									onSelect(parent);
								}}
							/>
						{/if}
						{#each children as child}
							<SelectAirportItem
								selected={value}
								airport={child}
								hasParent={!!parent}
								onSelect={() => {
									onSelect(child);
								}}
							/>
						{/each}
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
