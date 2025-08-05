<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { redirectToSearchTrain, saveLastSearchTrain } from '$lib/helpers/search-train-helper';
	import type { SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
	import { cn } from '$lib/utils';
	import { ArrowRight, ArrowRightLeft } from '@lucide/svelte';
	import dayjs from 'dayjs';

	type LastSearchItemProps = {
		searchTrain: SearchTrainParam;
	};

	let { searchTrain }: LastSearchItemProps = $props();

	function onClickItem() {
		saveLastSearchTrain(searchTrain);
		redirectToSearchTrain(searchTrain);
	}
</script>

<Button
	variant="outline"
	class="flex items-center justify-between rounded-lg border bg-white py-7"
	onclick={onClickItem}
>
	<div class="flex w-max items-center space-x-4">
		<img
			class="h-[24px] w-[24px] object-contain"
			src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
			alt="logo"
		/>

		<div class="text-left">
			<div class={cn('flex items-center space-x-2 font-medium text-gray-700')}>
				<div>{searchTrain.route?.origin}</div>
				{#if searchTrain.tripType === 'roundtrip'}
					<ArrowRightLeft size={16} />
				{:else}
					<ArrowRight size={16} />
				{/if}
				<div>{searchTrain.route?.destination}</div>
			</div>
			<div class="text-xs text-gray-500">
				{dayjs(searchTrain.route?.departureDate).format('DD MMMM YYYY')} · {searchTrain.adult +
					searchTrain.infant} pax
			</div>
		</div>
	</div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-5 w-5 text-gray-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
	</svg>
</Button>
