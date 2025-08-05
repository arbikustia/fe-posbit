<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';

	export const prices = [
		{ date: 'Fri, 7 Mar', price: 1599000, isAvailable: true },
		{ date: 'Sat, 8 Mar', price: 1420000, isAvailable: true },
		{ date: 'Sun, 9 Mar', price: 1350000, isAvailable: true },
		{ date: 'Mon, 10 Mar', price: 1285000, isAvailable: true },
		{ date: 'Tue, 11 Mar', price: 1310000, isAvailable: true },
		{ date: 'Wed, 12 Mar', price: 1260000, isAvailable: true },
		{ date: 'Thu, 13 Mar', price: 1200000, isAvailable: true },
		{ date: 'Fri, 14 Mar', price: 1395000, isAvailable: false }
	];

	let selectedIndex: number = -1; // default: tidak ada yang dipilih
</script>

<Carousel.Root>
	<Carousel.Content class="-ml-4">
		{#each prices as items, i}
			<Carousel.Item
				class={cn('basis-[24%] pl-4', {
					'pl-4': i > 0
				})}
			>
				<div class="p-1">
					<button
						class={cn('w-full rounded-lg border border-gray-300 bg-card py-3 text-sm', {
							'outline-solid outline-2 outline-primary': selectedIndex === i,
							'opacity-60': !items.isAvailable
						})}
						onclick={() => (selectedIndex = i)}
						disabled={!items.isAvailable}
					>
						<p>{items.date}</p>
						<p class="font-semibold">
							{#if !items.isAvailable}
								No Schedule
							{:else}
								{formatThousand(items.price)} IDR
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
