import type { BookingStatus } from '$lib/components/opsigo-ui/booking-status';
import type { BookingPrice } from '$lib/types/api/flight/booking/Booking';

export type FareDetailProps = {
	status: BookingStatus;
	price: BookingPrice;
};
