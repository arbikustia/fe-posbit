<script lang="ts">
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';

	export const dates = [
		{ date: 'Fri, 7 Mar', price: 1599000, isAvailable: true },
		{ date: 'Sat, 8 Mar', price: 1420000, isAvailable: true },
		{ date: 'Sun, 9 Mar', price: 1350000, isAvailable: true },
		{ date: 'Mon, 10 Mar', price: 1285000, isAvailable: true },
		{ date: 'Tue, 11 Mar', price: 1310000, isAvailable: true },
		{ date: 'Wed, 12 Mar', price: 1260000, isAvailable: true },
		{ date: 'Thu, 13 Mar', price: 1200000, isAvailable: true },
		{ date: 'Fri, 14 Mar', price: 1395000, isAvailable: false }
	];

	let selectedIndex = $state<number>(-1);
</script>

<div class="bg-primary/5 shadow-sm">
	<div
		class="scrollbar-hide flex overflow-x-auto"
		style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
	>
		{#each dates as date, i}
			<button
				onclick={() => {
					selectedIndex = i;
				}}
				class={cn(
					'date-item m-1 flex w-32 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-accent bg-card p-2',
					{
						'ring-2 ring-primary': selectedIndex === i
					}
				)}
			>
				<div class="text-xs">{date.date}</div>
				<div class="text-sm font-semibold">
					{date.isAvailable ? formatThousand(date.price) + ' IDR' : 'No Schedule'}
				</div>
			</button>
		{/each}
	</div>
</div>
