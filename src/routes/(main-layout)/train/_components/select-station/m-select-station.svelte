<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { useSelectStation } from './select-station.svelte.js';
	import SelectStationItem from './select-station-item.svelte';
	import type { Station } from './types.js';

	let { value = $bindable(), icon, placeholder } = $props();

	const { state, getSelectedStationDisplay, handleScroll, resetList, handleSearchDebounce } =
		useSelectStation();

	const selectedDisplay = $derived(getSelectedStationDisplay(value));

	function onSelect(selected: Station) {
		value = selected.stationCode;
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
						<span class="font-normal text-muted-foreground">Select Station</span>
					{:else}
						<span class="font-semibold">{selectedDisplay} </span>
					{/if}
				</div>
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content class="h-3/4 p-0">
		<Drawer.Header class="text-left">
			<Drawer.Title>Select Station</Drawer.Title>
		</Drawer.Header>
		<Command.Root shouldFilter={false}>
			<Command.Input {placeholder} bind:value={state.keyword} oninput={handleSearchDebounce} />
			<Command.List onscroll={handleScroll} class="max-h-full">
				<Command.Empty>Station not found.</Command.Empty>
				<Command.Group>
					{#each state.displayedStations as { parent, children }}
						{#if parent}
							<SelectStationItem
								selected={value}
								station={parent}
								onSelect={() => {
									onSelect(parent);
								}}
							/>
						{/if}
						{#each children as child}
							<SelectStationItem
								selected={value}
								station={child}
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
