import type { BookingStatus } from '$lib/components/opsigo-ui/booking-status';
import type { BookingPassenger } from '$lib/types/api/flight/booking/Booking';

export type PassengerAncillaryInfoProps = {
	status: BookingStatus;
	passengers: BookingPassenger[];
};
