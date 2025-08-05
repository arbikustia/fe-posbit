<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { type CommandItemProps } from 'bits-ui';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import type { Station } from './types';

	type SelectStationItemProps = {
		station: Station;
		hasParent?: boolean;
		selected: string;
	} & CommandItemProps;

	let { station, hasParent = false, selected, ...props }: SelectStationItemProps = $props();
</script>

<Command.Item
	value={station.stationCode}
	class={cn('cursor-pointer', {
		'pl-8': hasParent,
		'bg-primary/10': selected === station.stationCode
	})}
	{...props}
>
	<div class="flex w-full items-center py-1">
		<div class="flex w-full items-center gap-2">
			{#if station.isMetropolitan}
				<Icon icon="iconoir:city" class="h-5! w-5!" />
			{:else}
				<Icon icon="pepicons-pencil:train" class="h-5! w-5!" />
			{/if}
			<div class="flex-1">
				<div>{station.isMetropolitan ? station.cityName : station.stationName}</div>
				<div class="text-xs text-muted-foreground">
					{station.isMetropolitan ? station.stationName : station.cityName}
				</div>
			</div>
			<Badge variant="outline" class="block w-[50px] px-0 text-center text-sm"
				>{station.stationCode}</Badge
			>
		</div>
	</div>
</Command.Item>
