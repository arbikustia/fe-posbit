<script lang="ts">
	import { displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';
	import type { Trip } from '$lib/types/FlightResponse';

	type FlightSummaryTripCardProps = {
		trip: Trip;
	};

	let { trip }: FlightSummaryTripCardProps = $props();
</script>

<div class="w-full rounded-xl border p-3 shadow-md">
	<div class="flex items-center gap-4">
		<!-- AIRLINE LOGO + NAME -->
		<div class="flex items-center gap-3">
			<img
				class="max-h-[50px] w-[50px] object-contain"
				src={trip.platingCarrier.image}
				alt="logo"
			/>
		</div>

		<!-- DEPARTURE -> ARRIVAL -->
		<div class="flex flex-1 items-center gap-4">
			<!-- ORIGIN -->
			<div class=" text-center leading-none">
				<div class="text-lg font-medium">{displayTime(trip.departureDateTime)}</div>
				<div class="text-muted-foreground">{trip.origin.airport.code}</div>
			</div>

			<!-- DURATION -->
			<div class="flex w-full items-center justify-center gap-2 text-center">
				<div class="w-full border-b border-dashed border-muted-foreground"></div>
				<div class="text-sm text-muted-foreground">
					<div class="whitespace-nowrap">{formatTimeSpan(trip.travelTime)}</div>

					<div class="text-xs">{transitDisplay(trip.transitCount)}</div>
				</div>

				<div class="w-full border-b border-dashed border-muted-foreground"></div>
			</div>

			<!-- DESTINATION -->
			<div class="text-center leading-none">
				<div class="text-lg font-medium">{displayTime(trip.arrivalDateTime)}</div>
				<div class="text-muted-foreground">{trip.destination.airport.code}</div>
			</div>
		</div>
	</div>
</div>
