import dayjs from 'dayjs';
import { formatThousand } from '$lib/helpers/number-helper';
import type { DateSelectorState } from './types';

const TOTAL_DATES: number = 5;

export function useDateSelector() {
	const state = $state<DateSelectorState>({
		selectedDateIdx: 0,
		dates: [],
		dateContainerRef: null!
	});

	// Generate date item for temporary use
	function generateDates(currentDate: string) {
		const current = dayjs(currentDate);

		const middleIndex = Math.floor(TOTAL_DATES / 2);

		state.selectedDateIdx = middleIndex;

		state.dates = Array.from({ length: TOTAL_DATES }, (_, i) => {
			const dayOffset = i - middleIndex;
			const date = current.add(dayOffset, 'day');

			return {
				id: i,
				date: date.format('ddd, D MMM YYYY'),
				price: generateRandomPrice(),
				available: dayOffset === 0 ? true : Math.random() > 0.2,
				isCurrent: dayOffset === 0
			};
		});
	}

	// Generate random dummy price for temporary use
	function generateRandomPrice(): string {
		const basePrice: number = 2700000;
		const variance: number = Math.floor(Math.random() * 15) * 10000;
		const price: number = basePrice + variance;

		return `IDR ${formatThousand(price)}`;
	}

	function selectDate(index: number): void {
		state.selectedDateIdx = index;
	}

	function scrollToCenter(): void {
		if (state.dateContainerRef && state.dates.length > 0) {
			const dateItems: NodeListOf<HTMLDivElement> =
				state.dateContainerRef.querySelectorAll('.date-item');
			if (dateItems && dateItems[state.selectedDateIdx]) {
				const selectedItem: HTMLDivElement = dateItems[state.selectedDateIdx];
				const itemWidth: number = selectedItem.offsetWidth;

				const scrollPosition: number =
					selectedItem.offsetLeft - state.dateContainerRef.offsetWidth / 2 + itemWidth / 2.3;

				state.dateContainerRef.scrollTo({
					left: Math.max(0, scrollPosition),
					behavior: 'smooth'
				});
			}
		}
	}

	return {
		state,
		generateDates,
		selectDate,
		scrollToCenter
	};
}
