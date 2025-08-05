<script lang="ts">
	import { onMount } from 'svelte';
	import type { DateSelectorProps } from './types';
	import { useDateSelector } from './date-selector.svelte.js';
	import { cn } from '$lib/utils';

	let { currentDate }: DateSelectorProps = $props();
	const { state, generateDates, selectDate, scrollToCenter } = useDateSelector();

	onMount(() => {
		generateDates(currentDate);
		setTimeout(scrollToCenter, 100);
	});
</script>

<div>
	<div
		bind:this={state.dateContainerRef}
		class="scrollbar-hide flex overflow-x-auto"
		style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
	>
		{#each state.dates as date, i}
			<button
				onclick={() => {
					selectDate(i);
					scrollToCenter();
				}}
				class={cn(
					'date-item m-1 flex w-36 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border border-accent bg-card p-2 shadow-sm',
					{
						'ring-2 ring-primary': state.selectedDateIdx === i
					}
				)}
			>
				<div class="text-xs">{date.date}</div>
				<div class="font-semibold text-primary">
					{date.available ? date.price : 'No Flight'}
				</div>
			</button>
		{/each}
	</div>
</div>
