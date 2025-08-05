<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { type CommandItemProps } from 'bits-ui';
	import type { Airport } from '$lib/types/Airport';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Badge } from '$lib/components/ui/badge';

	type SelectAirportItemProps = {
		airport: Airport;
		hasParent?: boolean;
		selected: string;
	} & CommandItemProps;

	let { airport, hasParent = false, selected, ...props }: SelectAirportItemProps = $props();
</script>

<Command.Item
	value={airport.airportCode}
	class={cn('cursor-pointer', {
		'pl-8': hasParent,
		'bg-primary/10': selected === airport.airportCode
	})}
	{...props}
>
	<div class="flex w-full items-center py-1">
		<div class="flex w-full items-center gap-2">
			{#if airport.isMetropolitan}
				<Icon icon="iconoir:city" class="h-5! w-5!" />
			{:else}
				<Icon icon="fa6-solid:plane-up" class="h-5! w-5!" />
			{/if}
			<div class="flex-1">
				<div>{airport.cityName}, {airport.countryName}</div>
				<div class="text-xs text-muted-foreground">{airport.airportName}</div>
			</div>
			<Badge variant="outline" class="block w-[50px] px-0 text-center text-sm"
				>{airport.airportCode}</Badge
			>
		</div>
	</div>
</Command.Item>
