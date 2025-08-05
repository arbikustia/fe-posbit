<script lang="ts">
	import { Copy, Flight, Sync, TripleDot } from '$lib/components/icons';
	import Trash from '$lib/components/icons/trash.svelte';
	import {
		bookingStatusColor,
		OSGBookingStatus,
		type BookingStatus
	} from '$lib/components/opsigo-ui/booking-status';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Search } from '@lucide/svelte';
	import { FlightInfo } from '../flight-info';
	import { OtherAction, OtherActionItem } from '../other-action';
	import type { ReservationInfoProps } from './types';
	import { cn, copyToClipboard } from '$lib/utils';
	import {
		convertDateTimeToRelativeText,
		displayDate,
		displayUtcOffset
	} from '$lib/helpers/date-helper';

	let { status, pnrs }: ReservationInfoProps = $props();
</script>

{#snippet colonColumn()}
	<td class="px-2">:</td>
{/snippet}

{#snippet transitSeparator(text: string)}
	<div class="flex items-center justify-center gap-2 text-center">
		<div class="w-full border-b border-dashed border-gray-300"></div>

		<Badge class="w-full max-w-fit font-normal text-gray-500" variant="outline">{text}</Badge>

		<div class="w-full border-b border-dashed border-gray-300"></div>
	</div>
{/snippet}

{#each pnrs as pnr, pnrIdx}
	<Card.Root
		class="gap-0 overflow-hidden border-2 py-0"
		style="border-color: {bookingStatusColor[status]};"
	>
		<Card.Header class="p-4 text-white" style="background-color: {bookingStatusColor[status]};">
			<div class="flex items-center justify-between">
				{#if pnrs.length === 1 && pnrs[0].flights.length > 1}
					<div class="text-lg font-semibold">Flight Info</div>
				{:else}
					<div class="flex items-center gap-x-2 text-lg font-semibold">
						<Flight
							class={cn('rotate-45', {
								'-rotate-135': pnrs.length === 2 && pnrIdx === 1
							})}
							fill="white"
						/>
						<div>
							{pnrs.length > 2
								? `Flight ${pnrIdx + 1}`
								: pnrIdx === 0
									? 'Departure Flight'
									: 'Return Flight'}: {pnr.flights[0].origin.airport.code} - {pnr.flights[0]
								.destination.airport.code}
						</div>
					</div>
				{/if}

				<OtherAction>
					{#snippet triggerContent()}
						<TripleDot class="rotate-90" />
					{/snippet}
					{#snippet actions()}
						<OtherActionItem label="Retry Booking" onClick={() => {}}>
							{#snippet icon()}
								<Sync class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
						<Separator />
						<OtherActionItem label="Change Flight" onClick={() => {}}>
							{#snippet icon()}
								<Search class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
						<Separator />
						<OtherActionItem label="Remove PNR" onClick={() => {}}>
							{#snippet icon()}
								<Trash class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
					{/snippet}
				</OtherAction>
			</div>
		</Card.Header>
		<Card.Content class="p-4">
			<div class="mb-4 flex justify-between">
				<table>
					<tbody>
						<tr>
							<td>Provider</td>
							{@render colonColumn()}
							<td>
								<div class="flex items-center gap-x-1 font-semibold">
									<img class="h-5" src={pnr.providerImage} alt="Provider Logo" />
									{pnr.provider}
								</div>
							</td>
						</tr>
						<tr>
							<td>PNR Code</td>
							{@render colonColumn()}
							<td>
								<div class="flex items-center gap-x-2 text-lg font-bold">
									<div class="text-primary">
										{pnr.pnrCode}
									</div>
									<button onclick={() => copyToClipboard(pnr.pnrCode)}>
										<Copy />
									</button>
								</div>
							</td>
						</tr>
						<tr>
							<td>Time Limit</td>
							{@render colonColumn()}
							<td>
								{displayDate(pnr.timeLimit, 'DD MMM YYYY • HH:mm')} ({displayUtcOffset(
									pnr.timeLimit.utcOffset
								)})
								<span class="text-sm text-gray-500"
									>{convertDateTimeToRelativeText(pnr.timeLimit)}</span
								>
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<OSGBookingStatus class="text-lg" {status} />
				</div>
			</div>

			<div class="space-y-4">
				{#each pnr.flights as flight, flightIdx}
					<div class="space-y-2">
						{#if pnr.flights.length > 1}
							<div class="flex items-center gap-x-2 font-semibold">
								<Flight
									class={cn('rotate-45', {
										'-rotate-135': pnr.flights.length === 2 && flightIdx === 1
									})}
									fill="white"
								/>
								<div>
									{pnr.flights.length > 2
										? `Flight ${flightIdx + 1}`
										: flightIdx === 0
											? 'Departure Flight'
											: 'Return Flight'}: {flight.origin.airport.code} - {flight.destination.airport
										.code}
								</div>
							</div>
						{/if}

						<div class="rounded-3xl border">
							{#each flight.segments as segment, segmentIdx}
								<div class="p-4">
									<FlightInfo
										arriveDate={segmentIdx === 0 ? flight.arrivalDateTime : undefined}
										{segment}
									/>
								</div>
								<!-- {@render transitSeparator('Transits in Surabaya (SUB) for 13h 4m')} -->
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
{/each}
