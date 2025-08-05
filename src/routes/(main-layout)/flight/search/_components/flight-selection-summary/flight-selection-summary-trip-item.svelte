<script lang="ts">
	import * as dateHelper from '$lib/helpers/date-helper';
	import { cn } from '$lib/utils';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { FlightCardClass } from '../flight-card-class';
	import * as Card from '$lib/components/ui/card';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';
	import type { Trip } from '$lib/types/FlightResponse';
	import { FlightDetailDialog } from '../../../_components/flight-detail-dialog';

	type FlightSelectionSummaryTripItemProps = {
		trip: Trip;
		selectedFlightClassId: string;
		onClassSelect: (selectedClassId: string) => void;
	};

	let { trip, onClassSelect, selectedFlightClassId }: FlightSelectionSummaryTripItemProps =
		$props();

	let isFlightDetailDialogOpen = $state(false);
	let selectedClassId = $state(selectedFlightClassId);
</script>

<Card.Root class={cn('overflow-hidden py-0')}>
	<Card.Content class="relative px-4 py-2">
		<div>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-x-2">
					<img
						class="h-8 w-8 object-contain object-center"
						src={trip.platingCarrier.image}
						alt="Airline Logo"
					/>
					<p class="text-sm font-semibold">{trip.platingCarrier.name}</p>
				</div>

				<button
					class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full"
					onclick={(e) => {
						isFlightDetailDialogOpen = true;
					}}><ChevronDown class="h-4! w-4! text-primary/80" /></button
				>
			</div>
			<div class="flex flex-wrap justify-between gap-4">
				<!-- DEPARTURE -> ARRIVAL -->
				<div class="flex flex-1 items-center gap-3">
					<!-- ORIGIN -->
					<div class="text-center leading-none">
						<div class="text-lg font-medium">{dateHelper.displayTime(trip.departureDateTime)}</div>
						<div class="text-muted-foreground">{trip.origin.airport.code}</div>
					</div>

					<!-- DURATION -->
					<div class="flex max-w-[100px] flex-1 items-center justify-center gap-x-2 text-center">
						<div class="border-muted-foreground w-full border-b border-dashed"></div>
						<div class="text-sm">
							<div class="whitespace-nowrap">{dateHelper.formatTimeSpan(trip.travelTime)}</div>

							<div class="text-muted-foreground text-xs">{transitDisplay(trip.transitCount)}</div>
						</div>

						<div class="border-muted-foreground w-full border-b border-dashed"></div>
					</div>

					<!-- DESTINATION -->
					<div class="text-center leading-none">
						<div class="text-lg font-medium">{dateHelper.displayTime(trip.arrivalDateTime)}</div>
						<div class="text-muted-foreground">{trip.destination.airport.code}</div>
					</div>
				</div>
				<div class="space-y-1">
					<p class="text-xs">Price Per Pax</p>
					<FlightCardClass
						bind:value={
							() => selectedClassId,
							(newValue) => {
								onClassSelect(newValue);

								return (selectedClassId = newValue);
							}
						}
						classList={trip.classes}
					/>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<FlightDetailDialog bind:isOpen={isFlightDetailDialogOpen} {trip} classId={selectedClassId} />
