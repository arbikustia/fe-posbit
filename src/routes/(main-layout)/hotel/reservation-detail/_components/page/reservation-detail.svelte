<script>
	import { Attachment } from '../attachment';
	import { BookingContact } from '../booking-contact';
	import { BookInformation } from '../booking-information';
	import { EssentialInformation } from '../essential-information';
	import { Guest } from '../guest';
	import { HeaderReservation } from '../header';
	import { Histories } from '../histories';
	import { HotelInformation } from '../hotel-information';
	import { Payment } from '../payment';
	import { Policy } from '../policy';
	import { RemarkForHotel } from '../remark-for-hotel';
	import { RemarkForInternalUse } from '../remark-for-internal-use';
</script>

<div class="container">
	<HeaderReservation />
	<div class="flex w-full items-start justify-between gap-5">
		<div class="w-full">
			<BookInformation />
			<Payment />
			<Policy />
			<BookingContact />
		</div>
		<div class="w-full">
			<HotelInformation />
			<EssentialInformation />
			<Guest />
			<RemarkForInternalUse />
			<RemarkForHotel />
			<Attachment />
			<Histories />
		</div>
	</div>
</div>
