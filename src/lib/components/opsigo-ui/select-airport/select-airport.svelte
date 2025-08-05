<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { Airport } from '$lib/types/Airport';
	import { useSelectAirport } from './select-airport.svelte.js';
	import SelectAirportItem from './select-airport-item.svelte';
	import { cn } from '$lib/utils.js';

	let { value = $bindable(), icon, placeholder, triggerClass = '' } = $props();

	const { state, getSelectedAirportDisplay, handleScroll, resetList, handleSearchDebounce } =
		useSelectAirport();

	const selectedAirportDisplay = $derived(getSelectedAirportDisplay(value));

	function onSelect(selected: Airport) {
		value = selected.airportCode;
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
				class={cn('w-full max-w-full justify-start gap-1 px-2 focus-visible:ring-0', triggerClass)}
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
						Select Airport
					{:else}
						{selectedAirportDisplay}
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
	</Popover.Content>
</Popover.Root>
