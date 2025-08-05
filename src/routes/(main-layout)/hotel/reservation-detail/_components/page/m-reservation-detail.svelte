<script lang="ts">
	import { MBookingContact } from '../booking-contact';
	import { MBookInformation, MReservationInformation } from '../booking-information';
	import { MEssentialInformation } from '../essential-information';
	import { MGuest } from '../guest';
	import { MHeaderReservation } from '../header';
	import { MHistories } from '../histories';
	import { MHotelInformation } from '../hotel-information';
	import { MPolicy } from '../policy';
	import { MRemarkForInternalUse } from '../remark-for-internal-use';
	import { TotalPayment } from '../total-payment';
</script>

<MHeaderReservation />
<section class="bg-[#F8F8F8] py-20">
	<MBookInformation />
	<MReservationInformation />
	<MHotelInformation />
	<MEssentialInformation />
	<MGuest />
	<MRemarkForInternalUse />
	<MPolicy />
	<MBookingContact />
	<MHistories />
</section>
<TotalPayment />
