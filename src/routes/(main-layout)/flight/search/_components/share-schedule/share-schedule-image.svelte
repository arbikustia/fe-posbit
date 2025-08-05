<script lang="ts">
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Badge } from '$lib/components/ui/badge';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	import type { ScheduleResult, Trip } from '$lib/types/FlightResponse';
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';

	type ShareScheduleImageProps = {
		trips: Trip[];
		schedule: ScheduleResult;
	};

	let { trips, schedule }: ShareScheduleImageProps = $props();

	const thClass = 'bg-primary py-2 pr-4 text-start text-white';
	const tdClass = 'pr-4 py-1';
</script>

<div class="bg-white">
	<div class="px-4 pt-4">
		<img class="block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
	</div>

	<div class="my-2 px-4">
		<div class="flex items-center justify-between">
			<div class="font-semibold">
				Flight Schedule: {schedule.origin.city.name} ({schedule.origin.airport.code}) → {schedule
					.origin.city.name} ({schedule.destination.airport.code})
			</div>

			<p class="text-xs text-muted-foreground">
				Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}
			</p>
		</div>
		<div class="flex items-center justify-between text-sm">
			<p>
				Departure: {displayDate(schedule.departureDateTime, 'ddd, DD MMMM YYYY')}
			</p>
			<p>
				{trips.length} shedules available
			</p>
		</div>
	</div>
	<div class="px-4 pb-4">
		<table class="rounded-md text-sm">
			<thead>
				<tr>
					<th class={cn(thClass, 'px-2 py-1')}>No</th>
					<th class={thClass}>Airline</th>
					<th class={thClass}>Number</th>
					<th class={thClass}>Origin</th>
					<th class={thClass}>Destination</th>
					<th class={thClass}>Duration</th>
					<th class={thClass}>Class</th>
					<th class={cn(thClass, 'text-end')}>Price/pax</th>
				</tr>
			</thead>
			<tbody>
				{#each trips as trip, tripIdx}
					{#each trip.segments as segment, i}
						{#if segment.transitTime}
							<tr
								class={cn({
									'bg-primary/10': tripIdx % 2 !== 0
								})}
							>
								<td colspan="5" class={cn(tdClass, 'p-0 px-2 text-center text-xs')}>
									<div class="flex items-center gap-2">
										<OSGDashSeparator class="flex-1 border-b border-gray-300" />
										<Badge
											class="border-none bg-transparent text-[10px] font-normal text-muted-foreground"
											variant="outline"
											>{formatTimeSpan(segment.transitTime)} layover . {segment.origin.city.name} ({segment
												.origin.airport.code})</Badge
										>
										<OSGDashSeparator class="flex-1 border-b border-gray-300" />
									</div>
								</td>
							</tr>
						{/if}
						<tr
							class={cn({
								'bg-primary/10': tripIdx % 2 !== 0,
								'border-b border-primary': i === trip.segments.length - 1
							})}
						>
							{#if i === 0}
								<td
									class={cn(tdClass, 'px-2 text-center')}
									rowspan={trip.segments.length > 1 && i === 0
										? trip.segments.length + (trip.segments.length - 1)
										: 1}
								>
									{tripIdx + 1}
								</td>
							{/if}
							<td
								class={cn(tdClass, 'max-w-20', {
									'text-xs': segment.marketingCarrier.name.length > 10
								})}>{segment.marketingCarrier.name}</td
							>
							<td class={tdClass}>
								{segment.marketingCarrier.code}
								{segment.marketingCarrier.flightNumber}
							</td>
							<td class={tdClass}>
								{segment.origin.airport.code} ({displayTime(segment.departureDateTime)})
							</td>
							<td class={tdClass}>
								{segment.destination.airport.code} ({displayTime(segment.arrivalDateTime)})
							</td>
							<td class={tdClass}>{formatTimeSpan(segment.flightTime)}</td>
							{#if i === 0}
								<td
									class={tdClass}
									rowspan={trip.segments.length > 1 && i === 0
										? trip.segments.length + (trip.segments.length - 1)
										: 1}
								>
									{trip.classes[0].cabinClass}
								</td>
							{/if}
							{#if i === 0}
								<td
									class={cn(tdClass, 'text-end font-semibold')}
									rowspan={trip.segments.length > 1 && i === 0
										? trip.segments.length + (trip.segments.length - 1)
										: 1}
								>
									{formatThousand(trip.classes[0].fare.total)}
									{trip.classes[0].fare.currency}
								</td>
							{/if}
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
</div>
