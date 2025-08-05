import type { FlightCardProps } from './types';

export function useFlightCard() {
	const state = $state<{ selectedClassId: string }>({
		selectedClassId: ''
	});

	function getSelectedClass(selectedFlightClassId: FlightCardProps['selectedFlightClassId']) {
		return selectedFlightClassId === state.selectedClassId;
	}

	//prevent parent click
	function stopPropagation(
		e: MouseEvent & {
			currentTarget: EventTarget & (HTMLButtonElement | HTMLDivElement | HTMLAnchorElement);
		}
	) {
		e.stopPropagation();
	}

	return {
		state,
		getSelectedClass,
		stopPropagation
	};
}
