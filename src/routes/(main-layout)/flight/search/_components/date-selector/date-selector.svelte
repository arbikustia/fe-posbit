<script lang="ts">
	import { onMount } from 'svelte';
	import { useDateSelector } from './date-selector.svelte.js';
	import type { DateSelectorProps } from './types.js';
	import { cn } from '$lib/utils.js';
	import * as Carousel from '$lib/components/ui/carousel';

	let { currentDate }: DateSelectorProps = $props();
	const { state, generateDates, selectDate, scrollToCenter } = useDateSelector();

	onMount(() => {
		generateDates(currentDate);
		setTimeout(scrollToCenter, 100);
	});
</script>

<Carousel.Root>
	<Carousel.Content class="-ml-4">
		{#each state.dates as item, i}
			<Carousel.Item
				class={cn('basis-[24%] pl-4', {
					'pl-4': i > 0
				})}
			>
				<div class="p-1">
					<button
						class={cn('w-full rounded-lg border border-gray-300 bg-card py-3 text-sm', {
							'outline-solid outline-2 outline-primary': state.selectedDateIdx === i,
							'opacity-60': !item.available
						})}
						onclick={() => selectDate(i)}
						disabled={!item.available}
					>
						<p>{item.date}</p>
						<p class="font-semibold">
							{#if !item.available}
								No Flight
							{:else}
								{item.price}
							{/if}
						</p>
					</button>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous class="border-2 border-primary bg-transparent text-primary!" />
	<Carousel.Next class="border-2 border-primary bg-transparent text-primary!" />
</Carousel.Root>
