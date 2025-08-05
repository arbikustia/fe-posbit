import type { BookingStatus } from '$lib/components/opsigo-ui/booking-status';
import type { BookingHistory } from '$lib/types/api/flight/booking/Booking';

export type HistoryTimelineProps = {
	status: BookingStatus;
	histories: BookingHistory[];
};
