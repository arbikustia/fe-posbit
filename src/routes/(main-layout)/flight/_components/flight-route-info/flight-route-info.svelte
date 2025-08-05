<script lang="ts">
	import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
	import { cn } from '$lib/utils';
	import { ArrowRight, ArrowRightLeft } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type FlightRouteInfoProps = {
		origin: string;
		destination: string;
		originAirportCode?: string;
		destinationAirportCode?: string;
		flightType?: SearchFlightParam['flightType'];
	};

	let {
		origin,
		destination,
		originAirportCode,
		destinationAirportCode,
		flightType = 'oneway',
		class: className
	}: FlightRouteInfoProps & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex items-center space-x-2 text-lg font-medium', className)}>
	<div>
		{origin}
		{originAirportCode ? `(${originAirportCode})` : ''}
	</div>
	{#if flightType === 'roundtrip'}
		<ArrowRightLeft size={16} />
	{:else}
		<ArrowRight size={16} />
	{/if}
	<div>
		{destination}
		{destinationAirportCode ? `(${destinationAirportCode})` : ''}
	</div>
</div>
