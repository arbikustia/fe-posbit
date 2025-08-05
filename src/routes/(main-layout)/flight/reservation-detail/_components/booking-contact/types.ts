import type { BookingStatus } from '$lib/components/opsigo-ui/booking-status';
import type { BookingContact } from '$lib/types/api/flight/booking/Booking';

export type BookingContactProps = {
	status: BookingStatus;
	contact: BookingContact;
};
