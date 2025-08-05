<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { useSelectWrapper } from './use-seelct-wrapper.svelte';
	import type { Hotel } from '$lib/types/Hotel';

	let {
		options,
		value = $bindable(),
		placeholder = 'Search',
		title,
		variant = 'sticky',
		outlet,
		icon
	} = $props();
	const { state, handleScroll, resetList, handleSearchDebounce } = useSelectWrapper(options);

	function onSelect(item: any) {
		value = item;
		state.isOpenList = false;
	}
</script>

<Popover.Root bind:open={state.isOpenList} onOpenChange={(open) => !open && resetList()}>
	{#if title}
		<div class="mb-1 text-sm font-semibold text-gray-500">{title}</div>
	{/if}
	<!-- <div class="mb-1 text-sm font-semibold text-gray-500">{title}</div> -->
	<Popover.Trigger
		bind:ref={state.triggerRef}
		class={` ${variant == 'default' ? 'h-11 border border-gray-200 p-1' : variant == 'combination' ? "h-11": 'h-9'} w-full rounded-md `}
	>
		{#if variant == 'combination'}
			<Button
				variant="secondary"
				class="flex h-full w-full justify-start p-2 focus-visible:ring-0"
				role="combobox"
			>
				<div class=" w-full truncate">
					{#if value === ''}
						<span class="flex items-center justify-start gap-2 text-black"
							>{@render icon()} {placeholder}</span
						>
					{:else}
						<span class="flex w-fit items-center gap-2"> {@render icon()} {value}</span>
					{/if}
				</div>
			</Button>
		{:else if variant == 'default'}
			<Button
				variant="ghost"
				class="flex h-full w-full justify-start focus-visible:ring-0"
				role="combobox"
			>
				<div class="ml-1 w-full truncate">
					{#if value === ''}
						<span class="flex items-center justify-start gap-2 text-black"
							>{@render icon()} {placeholder}</span
						>
					{:else}
						<span class="flex w-fit items-center gap-2"> {@render icon()} {value}</span>
					{/if}
				</div>
			</Button>
		{:else}
			<Button
				variant="outline"
				class="flex h-full w-full justify-start focus-visible:ring-0"
				role="combobox"
			>
				<div class="ml-1 w-full truncate">
					{#if value === ''}
						<span class="flex items-center justify-start gap-2 text-black"
							>{@render icon()} {placeholder}</span
						>
					{:else}
						<span class="flex w-fit items-center gap-2"> {@render icon()} {value}</span>
					{/if}
				</div>
			</Button>
		{/if}
	</Popover.Trigger>

	<Popover.Content class="w-fit max-w-[420px] border p-0" side="bottom" align="start">
		<Command.Root shouldFilter={false}>
			<Command.Input
				class="w-full px-2"
				{placeholder}
				bind:value={state.keyword}
				oninput={handleSearchDebounce}
			/>
			<Command.List onscroll={handleScroll} class="custom-scrollbar">
				<Command.Empty>Data not found.</Command.Empty>

				<Command.Group>
					{#each state.displayedItems as item}
						{@render outlet({
							item: item,
							onSelect: (value: string) => onSelect(value)
						})}
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
