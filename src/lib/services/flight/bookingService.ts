import type { Booking } from '$lib/types/api/flight/booking/Booking';
import dummy from '$lib/dummy/reservation-detail/roundtrip-connecting.json';

export const bookingService = {
	getDetail: async (): Promise<Booking> => {
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		return dummy as unknown as Booking;
	}
};
