<script lang="ts">
	import { Phone } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import * as Card from '$lib/components/ui/card';
	import type { BookingContact } from '$lib/types/api/flight/booking/Booking';
	import { InfoRow } from '../info-row';
	import type { BookingContactProps } from './types';

	let { status, contact }: BookingContactProps = $props();
</script>

<Card.Root class="gap-0 border-2 py-0" style="border-color: {bookingStatusColor[status]};">
	<Card.Header class="pb-0! border-b p-2">
		<div class="flex items-center gap-2 font-semibold">
			<Phone />
			Booking Contact
		</div>
	</Card.Header>
	<Card.Content class="p-0">
		<InfoRow label="Name">
			<div class="col-span-2">{contact.name}</div>
		</InfoRow>
		<InfoRow label="Phone" highlighted>
			<a href="tel:{contact.phone}" class="col-span-2">{contact.phone}</a>
		</InfoRow>
		<InfoRow label="Email">
			<a href="mailto:{contact.email}" class="col-span-2">{contact.email}</a></InfoRow
		>
	</Card.Content>
</Card.Root>
