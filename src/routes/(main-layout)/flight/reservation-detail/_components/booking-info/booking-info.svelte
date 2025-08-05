<script lang="ts">
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import * as Card from '$lib/components/ui/card';
	import {
		convertDateTimeToRelativeText,
		displayDate,
		displayUtcOffset
	} from '$lib/helpers/date-helper';
	import type { BookingBy, BookingCustomer } from '$lib/types/api/flight/booking/Booking';
	import type { DateTime } from '$lib/types/FlightResponse';
	import { cn } from '$lib/utils';
	import { InfoRow } from '../info-row';

	type BookingInfoProps = {
		status?: BookingStatus;
		class?: string;
		bookingBy: BookingBy;
		customer: BookingCustomer;
		bookingDate: DateTime;
	};

	let { status, class: className, bookingBy, customer, bookingDate }: BookingInfoProps = $props();
</script>

<Card.Root
	class={cn('overflow-hidden border-2 py-0', className)}
	style={status ? `border-color: ${bookingStatusColor[status]};` : ''}
>
	<Card.Content class="p-0 text-sm">
		<InfoRow label="Company">
			<div class="col-span-2">{customer.name}</div>
		</InfoRow>
		<InfoRow label="Booked by" highlighted>
			<div class="col-span-2">
				<div>{bookingBy.name}</div>
				<div class="text-muted-foreground text-sm">{bookingBy.companyName}</div>
			</div>
		</InfoRow>
		<InfoRow label="Booking Date">
			<div class="col-span-2">
				<div>
					{displayDate(bookingDate, 'DD MMM YYYY • HH:mm')} ({displayUtcOffset(
						bookingDate.utcOffset
					)})
				</div>
				<div class="text-muted-foreground text-sm">
					<i>{convertDateTimeToRelativeText(bookingDate)}</i>
				</div>
			</div>
		</InfoRow>
	</Card.Content>
</Card.Root>
