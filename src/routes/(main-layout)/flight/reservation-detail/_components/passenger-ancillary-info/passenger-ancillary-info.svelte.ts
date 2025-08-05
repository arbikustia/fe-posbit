import type { BookingPassenger } from '$lib/types/api/flight/booking/Booking';

export function usePassengerAncillaryInfo() {
	function countPassengerTypes(passengers: BookingPassenger[]) {
		const counts: Record<'adult' | 'child' | 'infant', number> = {
			adult: 0,
			child: 0,
			infant: 0
		};

		for (const passenger of passengers) {
			const type = passenger.type.toLowerCase() as 'adult' | 'child' | 'infant';
			if (type in counts) {
				counts[type]++;
			}
		}

		return counts;
	}

	return {
		countPassengerTypes
	};
}
