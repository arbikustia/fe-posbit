<script lang="ts">
	import type { SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
	import { cn } from '$lib/utils';
	import { ArrowRight, ArrowRightLeft } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type TripRouteInfoProps = {
		origin: string;
		destination: string;
		originCode?: string;
		destinationCode?: string;
		tripType?: SearchTrainParam['tripType'];
	};

	let {
		origin,
		destination,
		originCode,
		destinationCode,
		tripType = 'oneway',
		class: className
	}: TripRouteInfoProps & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex items-center space-x-2 text-lg font-medium', className)}>
	<div>
		{origin}
		{originCode ? `(${originCode})` : ''}
	</div>
	{#if tripType === 'roundtrip'}
		<ArrowRightLeft size={16} />
	{:else}
		<ArrowRight size={16} />
	{/if}
	<div>
		{destination}
		{destinationCode ? `(${destinationCode})` : ''}
	</div>
</div>
