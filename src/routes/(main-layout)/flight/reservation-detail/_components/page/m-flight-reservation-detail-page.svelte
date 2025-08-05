<script lang="ts">
	import { Copy, Mail, Phone, User } from '$lib/components/icons';
	import {
		bookingStatusColor,
		OSGBookingStatus,
		type BookingStatus
	} from '$lib/components/opsigo-ui/booking-status';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { copyToClipboard } from '$lib/utils';
	import { FlightRouteInfo } from '../../../_components/flight-route-info';
	import { MBookingContact } from '../booking-contact';
	import { BookingInfo } from '../booking-info';
	import { MFareDetail } from '../fare-detail';
	import { MHistoryTimeline } from '../history-timeline';
	import { MOtherAction } from '../other-action';
	import { MPassengerAncillaryInfo } from '../passenger-ancillary-info';
	import MRemarkAttachmentCard from '../remark-attachment-card/m-remark-attachment-card.svelte';
	import { MReservationDetailSkeleton } from '../reservation-detail-skeleton';
	import { MReservationInfo } from '../reservation-info';
	import { useFlightReservationDetailPage } from './flight-reservation-detail-page.svelte.js';

	const status: BookingStatus = 'reserved';

	const { state, getFlightType } = useFlightReservationDetailPage();

	const flightType = $derived(getFlightType());

	const multicityNumberOfFlights = $derived.by(() => {
		const pnrsLength = state.booking?.pnrs.length ?? 0;
		const flightLength = state.booking?.pnrs[0].flights.length ?? 0;

		if (pnrsLength > 2) {
			return pnrsLength;
		}

		return flightLength;
	});

	const flightOrigin = $derived.by(() => {
		return state.booking?.pnrs[0].flights[0].origin.city.name ?? '';
	});

	const flightDestination = $derived.by(() => {
		return state.booking?.pnrs[0].flights[0].destination.city.name ?? '';
	});
</script>

{#if state.isLoading}
	<MReservationDetailSkeleton />
{:else if state.booking !== null}
	<MOSGAppBar class="h-fit text-white" style="background-color: {bookingStatusColor[status]};">
		{#snippet leftContent()}
			<div>
				{#if flightType === 'multicity'}
					{multicityNumberOfFlights} Flights
				{:else}
					<FlightRouteInfo
						class="font-normal"
						origin={flightOrigin}
						destination={flightDestination}
						{flightType}
					/>
				{/if}
				<div class="flex flex-wrap items-center gap-1">
					<p class="text-xs">PNR Code</p>
					{#each state?.booking?.pnrs ?? [] as pnr, pnrIdx}
						{@const isLast = pnrIdx === (state?.booking?.pnrs.length ?? 0) - 1}
						<div class="flex items-center gap-1">
							<div class="ml-1 text-sm font-bold">{pnr.pnrCode}</div>
							<button onclick={() => copyToClipboard(pnr.pnrCode)}>
								<Copy class="h-4 w-4" />
							</button>
						</div>
						{#if !isLast}
							<span>+</span>
						{/if}
					{/each}
				</div>
			</div>
		{/snippet}
		{#snippet rightContent()}
			<OSGBookingStatus status="reserved" class="border-none bg-white" />
		{/snippet}
	</MOSGAppBar>

	<div class="relative space-y-4 pb-28 pt-24">
		<BookingInfo
			class="rounded-none"
			customer={state.booking.customer}
			bookingBy={state.booking.bookingBy}
			bookingDate={state.booking.bookingDateTime}
		/>

		<MReservationInfo {status} pnrs={state.booking.pnrs} />

		<MPassengerAncillaryInfo passengers={state.booking.passengers} />

		<MBookingContact contact={state.booking.bookingContact} />

		<MRemarkAttachmentCard type="remark" />
		<MRemarkAttachmentCard type="attachment" />

		<MHistoryTimeline histories={state.booking.histories} />

		<div class="fixed bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			<MFareDetail price={state.booking.price} />
			<div class="flex items-center gap-x-2">
				<MOtherAction />
				<Button class="bg-green-600 px-8 hover:bg-green-700">Issued Ticket</Button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full items-center justify-center">
		<p class="text-lg text-gray-500">Not found</p>
	</div>
{/if}
