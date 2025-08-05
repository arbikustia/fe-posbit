import { formatThousand } from '$lib/helpers/number-helper';
import type { z } from 'zod';
import type { baggageSchema } from '../page/schema';

export function useFlightAncillaryBaggageSummary() {
	function getTripBaggageNames(tripBaggages: z.infer<typeof baggageSchema>[]) {
		return tripBaggages.map((item) => item.baggageName).join(', ');
	}

	function getTripBaggageTotalPrice(tripBaggages: z.infer<typeof baggageSchema>[]) {
		const total = tripBaggages.reduce((sum, item) => {
			return (sum += item.baggagePrice);
		}, 0);

		return `${formatThousand(total)} ${tripBaggages[0]?.baggageCurrencyCode}`;
	}

	function getAllBaggageTotalPrice(baggages: z.infer<typeof baggageSchema>[]) {
		const total = baggages.reduce((sum, item) => {
			return (sum += item.baggagePrice);
		}, 0);

		return `${formatThousand(total)} ${baggages[0]?.baggageCurrencyCode}`;
	}

	function mergeBaggageByTripIndex(
		data: z.infer<typeof baggageSchema>[]
	): z.infer<typeof baggageSchema>[][] {
		const grouped: Record<number, z.infer<typeof baggageSchema>[]> = {};

		for (const item of data) {
			const { tripIndex } = item;
			if (!grouped[tripIndex]) {
				grouped[tripIndex] = [];
			}
			grouped[tripIndex].push(item);
		}

		return Object.keys(grouped)
			.map(Number)
			.sort((a, b) => a - b)
			.map((index) => grouped[index]);
	}

	return {
		getTripBaggageNames,
		getTripBaggageTotalPrice,
		getAllBaggageTotalPrice,
		mergeBaggageByTripIndex
	};
}
