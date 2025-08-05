<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FlightSummarySegmentLabel } from '../../../_components/flight-summary';
	import { InfoRow } from '../info-row';
	import dayjs from 'dayjs';
	import { MFLightInfo } from '../flight-info';
	import { OSGBookingStatus, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import type { ReservationInfoProps } from './types';
	import {
		convertDateTimeToRelativeText,
		displayDate,
		displayUtcOffset
	} from '$lib/helpers/date-helper';

	let { status, pnrs }: ReservationInfoProps = $props();

	function getFlightType(flightLength: number) {
		const pnrsLength = pnrs.length;

		if (pnrs.length > 2 || flightLength > 2) {
			if (pnrs.length > 2) {
				return `Flight ${pnrsLength}`;
			}
		}
	}
</script>

{#each pnrs as pnr, pnrIdx}
	<Card.Root class="rounded-none">
		<Card.Content class="relative p-0">
			<div class="absolute -top-3 m-auto flex w-full justify-center">
				<OSGBookingStatus {status} class="bg-white" />
			</div>
			<div class="py-4 text-sm">
				<InfoRow label="Provider">
					<div class="col-span-2 flex items-center gap-2">
						<img class="h-5" alt="Airplane Logo" src={pnr.providerImage} />
						{pnr.provider}
					</div>
				</InfoRow>
				<InfoRow label="Time Limit">
					<div class="col-span-2">
						<div>
							{displayDate(pnr.timeLimit, 'DD MMM YYYY • HH:mm')} ({displayUtcOffset(
								pnr.timeLimit.utcOffset
							)})
						</div>
						<div class="text-sm text-muted-foreground">
							<i>{convertDateTimeToRelativeText(pnr.timeLimit)}</i>
						</div>
					</div>
				</InfoRow>
			</div>
			<OSGDashSeparator class="border-b border-gray-300" />
			<div class="space-y-4 p-4">
				{#each pnr.flights as flight, flightIdx}
					{@const pnrsLength = pnrs.length}
					{@const flightLength = pnr.flights.length}
					{@const getFlightSegmentLabel = () => {
						let label = '';
						let dateTime;
						if (pnrsLength > 2 || flightLength > 2) {
							if (pnrsLength > 2) {
								label = `Flight ${pnrIdx + 1}`;
								dateTime = pnr.flights[0].departureDateTime;
							} else {
								label = `Flight ${flightIdx + 1}`;
								dateTime = flight.departureDateTime;
							}
						} else {
							if (pnrsLength === 2) {
								label = pnrIdx === 0 ? 'Departure' : 'Return';
								dateTime = pnr.flights[0].departureDateTime;
							} else {
								label = flightIdx === 0 ? 'Departure' : 'Return';
								dateTime = flight.departureDateTime;
							}
						}

						return {
							label,
							dateTime
						};
					}}
					<div class="space-y-2">
						<FlightSummarySegmentLabel
							label={getFlightSegmentLabel().label}
							labelType="text"
							dateTime={getFlightSegmentLabel().dateTime}
							isActive={false}
						/>
						<MFLightInfo {flight} />
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
{/each}
