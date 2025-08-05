import { formatThousand } from '$lib/helpers/number-helper';
import type { z } from 'zod';
import type { mealSchema } from '../page/schema';

type Meal = Pick<
	z.infer<typeof mealSchema>,
	'mealName' | 'mealId' | 'mealPrice' | 'mealCurrencyCode'
>;

type GroupedPassengerMeals = {
	tripIndex: number;
	segmentIndex: number;
	meals: Meal[];
};

export function useFlightAncillaryMealSummary() {
	function getPassengerIdxsBySegment(mealSegments: z.infer<typeof mealSchema>[]) {
		const seen = new Set();
		return mealSegments
			.filter((meal) => {
				if (seen.has(meal.passengerIdx)) {
					return false;
				}
				seen.add(meal.passengerIdx);
				return true;
			})
			.map((meal) => meal.passengerIdx);
	}

	function getAllMealTotalPrice(meals: z.infer<typeof mealSchema>[]) {
		const total = meals.reduce((sum, item) => {
			return (sum += item.mealPrice);
		}, 0);

		return `${formatThousand(total)} ${meals[0]?.mealCurrencyCode}`;
	}

	function getMealSegmentTotalPrice(mealByTripAndSegment: Meal[]) {
		const total = mealByTripAndSegment.reduce((sum, item) => {
			return (sum += item.mealPrice);
		}, 0);

		return `${formatThousand(total)} ${mealByTripAndSegment[0]?.mealCurrencyCode}`;
	}

	function groupMealsByTripSegmentPassenger(
		items: z.infer<typeof mealSchema>[]
	): GroupedPassengerMeals[] {
		const groupedMap = new Map<string, Meal[]>();

		for (const item of items) {
			const groupKey = `${item.tripIndex}-${item.segmentIndex}`;
			if (!groupedMap.has(groupKey)) {
				groupedMap.set(groupKey, []);
			}

			const tripSegmentMap = groupedMap.get(groupKey)!;

			tripSegmentMap.push({
				mealName: item.mealName,
				mealId: item.mealId,
				mealPrice: item.mealPrice,
				mealCurrencyCode: item.mealCurrencyCode
			});
		}

		const result: GroupedPassengerMeals[] = [];

		const sortedKeys = Array.from(groupedMap.keys()).sort((a, b) => {
			const [tripA, segmentA] = a.split('-').map(Number);
			const [tripB, segmentB] = b.split('-').map(Number);
			return tripA - tripB || segmentA - segmentB;
		});

		for (const key of sortedKeys) {
			const [tripIndex, segmentIndex] = key.split('-').map(Number);

			result.push({
				tripIndex,
				segmentIndex,
				meals: groupedMap.get(key)!.map((meal) => ({
					mealName: meal.mealName,
					mealId: meal.mealId,
					mealPrice: meal.mealPrice,
					mealCurrencyCode: meal.mealCurrencyCode
				}))
			});
		}

		return result;
	}

	return {
		getPassengerIdxsBySegment,
		getAllMealTotalPrice,
		getMealSegmentTotalPrice,
		groupMealsByTripSegmentPassenger
	};
}
