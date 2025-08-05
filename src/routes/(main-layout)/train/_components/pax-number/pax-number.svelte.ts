import type { PaxNumberState } from './types';

const maxPax = 4;

export function usePaxNumber() {
	const state = $state<PaxNumberState>({
		adult: 1,
		infant: 0,
		isOpenList: false,
		triggerRef: null!
	});

	function closeAndFocusTrigger() {
		state.isOpenList = false;
	}

	function infantChange(num: number) {
		state.infant += num;
		if (state.infant < 0) {
			state.infant = 0;
		}

		if (state.infant > state.adult) {
			state.infant = state.adult;
		}
	}

	function isMaxPax() {
		if (state.adult > maxPax) {
			return true;
		}
		return false;
	}
	function adultChange(num: number) {
		state.adult += num;
		if (state.adult < 1) {
			state.adult = 1;
		}

		if (num == -1) {
			infantChange(0);
		}

		if (isMaxPax()) {
			state.adult -= 1;
		}
	}

	function displaySelectedText({ adult, infant }: Pick<PaxNumberState, 'adult' | 'infant'>) {
		let text = adult + ' Adult';

		if (infant > 0) {
			text += `, ${infant} Infant`;
		}
		return text;
	}

	function reset() {
		state.adult = 1;
		state.infant = 0;
	}

	return {
		state,
		closeAndFocusTrigger,
		reset,
		displaySelectedText,
		adultChange,
		infantChange
	};
}
