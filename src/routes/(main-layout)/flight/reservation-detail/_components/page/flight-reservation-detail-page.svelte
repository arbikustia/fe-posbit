<script lang="ts">
	import { Cut, Forbidden, Send, Share, Sync, TripleDot } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { Attachment } from '../attachment';
	import { BookingContact } from '../booking-contact';
	import { BookingInfo } from '../booking-info';
	import { FareDetail } from '../fare-detail';
	import { HistoryTimeline } from '../history-timeline';
	import { OtherAction, OtherActionItem } from '../other-action';
	import { PassengerAncillaryInfo } from '../passenger-ancillary-info';
	import { Remark } from '../remark';
	import { ReservationDetailSkeleton } from '../reservation-detail-skeleton';
	import { ReservationInfo } from '../reservation-info';
	import { useFlightReservationDetailPage } from './flight-reservation-detail-page.svelte.js';

	const status: BookingStatus = 'reserved';

	const { state, getFlightTypeLabel } = useFlightReservationDetailPage();
</script>

<div class="container">
	{#if state.isLoading}
		<ReservationDetailSkeleton />
	{:else if state.booking === null}
		<div class="flex h-full items-center justify-center">
			<p class="text-lg text-gray-500">Not found</p>
		</div>
	{:else}
		<div class="mb-3 flex justify-between">
			<div>
				<h1 class="text-xl font-semibold">Flight Reservation</h1>
				<p>{getFlightTypeLabel()} ({state.booking?.pnrs.length} PNR)</p>
			</div>
			<div class="flex items-center gap-x-2">
				<Button class="bg-green-600 hover:bg-green-700">Issued Ticket</Button>
				<Button class="bg-gray-200 text-black hover:bg-gray-300">
					<Share />
				</Button>
				<OtherAction
					triggerClass={cn(buttonVariants(), 'bg-gray-200 text-black hover:bg-gray-300')}
				>
					{#snippet triggerContent()}
						<TripleDot />
					{/snippet}
					{#snippet actions()}
						<OtherActionItem label="Sync PNR" onClick={() => {}}>
							{#snippet icon()}
								<Sync class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
						<Separator />
						<OtherActionItem label="Separate PNR" onClick={() => {}}>
							{#snippet icon()}
								<Cut class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
						<Separator />
						<OtherActionItem label="Cancel Booking" onClick={() => {}}>
							{#snippet icon()}
								<Forbidden class="h-5 w-5" />
							{/snippet}
						</OtherActionItem>
					{/snippet}
				</OtherAction>
			</div>
		</div>

		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-8 space-y-4">
				<ReservationInfo {status} pnrs={state.booking.pnrs} />
				<PassengerAncillaryInfo {status} passengers={state.booking.passengers} />
			</div>
			<div class="col-span-4 space-y-4">
				<BookingInfo
					{status}
					customer={state.booking.customer}
					bookingBy={state.booking.bookingBy}
					bookingDate={state.booking.bookingDateTime}
				/>

				<Card.Root class="border-2 py-0" style="border-color: {bookingStatusColor[status]};">
					<Card.Content class="p-4">
						<div class="flex items-center justify-between">
							<p class="font-semibold">Invoice Status</p>
							<Button class="capitalize" variant="outline">
								<Send />
								Post to Back Office
							</Button>
						</div>
					</Card.Content>
				</Card.Root>

				<FareDetail {status} price={state.booking.price} />

				<BookingContact {status} contact={state.booking.bookingContact} />

				<Remark {status} />

				<Attachment {status} />

				<HistoryTimeline {status} histories={state.booking.histories} />
			</div>
		</div>
	{/if}
</div>
