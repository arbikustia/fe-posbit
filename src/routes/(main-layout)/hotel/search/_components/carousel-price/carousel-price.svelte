<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { price_hotels } from '$lib/constants/hotel';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let selectedIndex: number = -1; // default: tidak ada yang dipilih
</script>

<Carousel.Root class="w-full">
	<Carousel.Content class="-ml-1">
		<div class=" flex w-full">
			{#each price_hotels as date, i}
				<Carousel.Item class="basis-[19.28%] pl-1">
					<button
						onclick={() => (selectedIndex = i)}
						class={cn(
							'date-item m-1 flex h-16 w-32 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-transparent p-2 transition-colors',
							{
								'border-transparent ring-2 ring-primary': selectedIndex === i
							}
						)}
					>
						<div class="text-xs">{date.date}</div>
						<div class="font-semibold text-primary">
							IDR {date.price}
						</div>
					</button>
				</Carousel.Item>
			{/each}
		</div>
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>
