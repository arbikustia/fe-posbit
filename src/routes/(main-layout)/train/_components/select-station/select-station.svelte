<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { useSelectStation } from './select-station.svelte.js';
	import SelectStationItem from './select-station-item.svelte';
	import type { Station } from './types.js';
	import { cn } from '$lib/utils.js';

	let { value = $bindable(), icon, placeholder, triggerClass = '' } = $props();

	const { state, getSelectedStationDisplay, handleScroll, resetList, handleSearchDebounce } =
		useSelectStation();

	const selectedStationDisplay = $derived(getSelectedStationDisplay(value));

	function onSelect(selected: Station) {
		value = selected.stationCode;
		state.isOpenList = false;
	}
</script>

<Popover.Root
	bind:open={state.isOpenList}
	onOpenChange={(open) => {
		if (!open) {
			resetList();
		}
	}}
>
	<Popover.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="ghost"
				{...props}
				class={cn('flex w-full justify-start px-2 focus-visible:ring-0', triggerClass)}
				role="combobox"
			>
				<div class="text-muted-foreground">
					{@render icon()}
				</div>

				<div
					class={cn('ml-1 line-clamp-1 font-semibold', {
						'text-muted-foreground font-normal': value === ''
					})}
				>
					{#if value === ''}
						Select Station
					{:else}
						{selectedStationDisplay}
					{/if}
				</div>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[400px] p-0" side="bottom" align="start">
		<Command.Root shouldFilter={false}>
			<Command.Input {placeholder} bind:value={state.keyword} oninput={handleSearchDebounce} />
			<Command.List onscroll={handleScroll} class="custom-scrollbar">
				<Command.Empty>Airport not found.</Command.Empty>
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
	</Popover.Content>
</Popover.Root>
