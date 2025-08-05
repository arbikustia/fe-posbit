<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Star } from '@lucide/svelte';
	import { formatThousand } from '$lib/helpers/number-helper';
	// import type { HotelResult } from '$lib/types/HotelResponse';

	interface HotelResult {
		id: number; // Unique identifier for the hotel
		name: string; // Name of the hotel (e.g., "Srivijaya Hotel")
		starRating: number; // Star rating (1-5)
		address: string; // Full address of the hotel
		price: number; // Price per night in IDR (Indonesian Rupiah)
		// Potentially other properties that might be included:
		// image?: string; // URL of hotel image
		// amenities?: string[]; // Array of amenities
		// rating?: number; // User rating (e.g., 4.2)
	}

	type ShareHotelItemProps = {
		hotel: HotelResult;
		onCheck?: () => void;
		checked?: boolean;
		compact?: boolean;
		index?: number;
	};

	let { hotel, onCheck, checked, compact, index }: ShareHotelItemProps = $props();
</script>

{#snippet starRating(rating: number)}
	<div class="flex items-center">
		{#each { length: rating } as _, i}
			<Star class="h-3 w-3 fill-yellow-400 text-yellow-400" />
		{/each}
		{#each { length: 5 - rating } as _, i}
			<Star class="h-3 w-3 text-gray-300" />
		{/each}
	</div>
{/snippet}

{#snippet defaultItem()}
	<div class="border-b p-4">
		<div class="flex items-start gap-4">
			<div class="w-4">
				<Checkbox bind:checked={() => checked, () => {}} onclick={onCheck} />
			</div>
			<div class="flex-1">
				<div class="flex items-start justify-between">
					<h3 class="font-medium">{hotel.name}</h3>
					<p class="font-semibold text-primary">
						{formatThousand(hotel.price)} IDR
					</p>
				</div>
				<div class="mt-1 flex items-center gap-2">
					{@render starRating(hotel.starRating)}
					<span class="text-xs text-muted-foreground">{hotel.starRating} star</span>
				</div>
				<p class="mt-2 text-sm text-muted-foreground">{hotel.address}</p>
			</div>
		</div>
	</div>
{/snippet}

{#snippet compactItem()}
	<div class="border-b bg-white p-4">
		<div class="flex justify-between">
			<div>
				<Badge class="mb-2 bg-gray-200 text-black">Option #{index}</Badge>
				<h3 class="font-medium">{hotel.name}</h3>
				<div class="mt-1 flex items-center gap-2">
					{@render starRating(hotel.starRating)}
				</div>
				<p class="mt-2 text-sm text-muted-foreground">{hotel.address}</p>
			</div>
			<div class="flex flex-col items-end">
				<p class="font-semibold text-primary">
					{formatThousand(hotel.price)} IDR
				</p>
			</div>
		</div>
	</div>
{/snippet}

{#if compact}
	{@render compactItem()}
{:else}
	{@render defaultItem()}
{/if}
