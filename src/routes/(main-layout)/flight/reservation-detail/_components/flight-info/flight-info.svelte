<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Icon from '@iconify/svelte';
	import type { FlightInfoProps } from './types';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';

	let { arriveDate, segment }: FlightInfoProps = $props();
</script>

<div class="grid grid-cols-12 items-center gap-x-4">
	<div class="col-span-3 flex flex-col items-center text-center text-sm">
		<img
			class="mb-2 h-10 w-10 object-contain"
			src={segment.marketingCarrier.image}
			alt="Airplan Logo"
		/>
		<p>{segment.marketingCarrier.code} {segment.marketingCarrier.flightNumber}</p>
		<p>{segment.aircraft.shortName}</p>
		<p>Economy (N)</p>
	</div>
	<div class="col-span-9">
		<div class="mb-1 grid grid-cols-3">
			<p class="col-span-2 text-lg font-semibold">
				{displayDate(segment.departureDateTime, 'dddd, DD MMM YYYY')}
			</p>

			{#if arriveDate}
				<Badge class="w-fit" variant="outline"
					>Arrive on {displayDate(arriveDate, 'ddd, DD MMM')}</Badge
				>
			{/if}
		</div>

		<div class="grid grid-cols-3 gap-x-4">
			<div>
				<p class="text-lg">{displayTime(segment.departureDateTime)}</p>
				<p>{segment.origin.city.name} ({segment.origin.airport.code})</p>
				<p class="text-sm text-gray-500">{segment.origin.airport.name}</p>
			</div>
			<div class="pt-3">
				<div class="text-center">
					<p class="text-xs text-gray-500">{formatTimeSpan(segment.flightTime)}</p>
					<div class="flex items-center justify-center gap-2 text-center">
						<div class="w-10 border-b border-dashed border-muted-foreground"></div>
						<div class="text-sm text-muted-foreground">
							<div class="whitespace-nowrap">
								<Icon icon="ion:airplane-outline" width="24" height="24" />
							</div>
						</div>

						<div class="w-10 border-b border-dashed border-muted-foreground"></div>
					</div>
				</div>
			</div>
			<div>
				<p class="text-lg">{displayTime(segment.arrivalDateTime)}</p>
				<p>{segment.destination.city.name} ({segment.destination.airport.code})</p>
				<p class="text-sm text-gray-500">{segment.destination.airport.name}</p>
			</div>
		</div>
	</div>
</div>
