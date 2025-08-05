import type { z } from 'zod';
import type { seatSchema } from '../page/schema';
import { formatThousand } from '$lib/helpers/number-helper';

export function useFlightAncillarySeatSummary() {
	function getAllSeatTotalPrice(seats: z.infer<typeof seatSchema>[]) {
		const total = seats.reduce((sum, item) => {
			return (sum += item.seatPrice);
		}, 0);

		return `${formatThousand(total)} ${seats[0]?.seatCurrencyCode}`;
	}

	function getSeatNames(seatByTripAndSegment: z.infer<typeof seatSchema>[]) {
		return seatByTripAndSegment.map((item) => item.seatNumber).join(', ');
	}

	function getSeatSegmentTotalPrice(seatByTripAndSegment: z.infer<typeof seatSchema>[]) {
		const total = seatByTripAndSegment.reduce((sum, item) => {
			return (sum += item.seatPrice);
		}, 0);

		return `${formatThousand(total)} ${seatByTripAndSegment[0]?.seatCurrencyCode}`;
	}

	function groupSeatsByTripAndSegment(
		data: z.infer<typeof seatSchema>[]
	): z.infer<typeof seatSchema>[][] {
		const grouped: Record<string, z.infer<typeof seatSchema>[]> = {};

		for (const item of data) {
			const key = `${item.tripIndex}-${item.segmentIndex}`;
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(item);
		}

		// Urutkan berdasarkan tripIndex lalu segmentIndex
		return Object.keys(grouped)
			.map((key) => ({
				key,
				tripIndex: parseInt(key.split('-')[0], 10),
				segmentIndex: parseInt(key.split('-')[1], 10),
				items: grouped[key]
			}))
			.sort((a, b) =>
				a.tripIndex === b.tripIndex ? a.segmentIndex - b.segmentIndex : a.tripIndex - b.tripIndex
			)
			.map((group) => group.items);
	}

	return {
		getAllSeatTotalPrice,
		getSeatNames,
		getSeatSegmentTotalPrice,
		groupSeatsByTripAndSegment
	};
}
