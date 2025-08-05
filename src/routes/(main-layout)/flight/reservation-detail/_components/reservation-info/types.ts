import type { BookingStatus } from '$lib/components/opsigo-ui/booking-status';
import type { BookingPnr } from '$lib/types/api/flight/booking/Booking';

export type ReservationInfoProps = {
	status: BookingStatus;
	pnrs: BookingPnr[];
};
