export type PaxNumberState = {
	adult: number;
	child: number;
	infant: number;
	isOpenList: boolean;
	triggerRef: HTMLButtonElement;
};

const maxPax = 7;

export function usePaxNumber() {
	const state = $state<PaxNumberState>({
		adult: 1,
		child: 0,
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

	function childChange(num: number) {
		state.child += num;
		if (state.child < 0) {
			state.child = 0;
		}

		if (isMaxPax()) {
			state.child -= 1;
		}
	}

	function isMaxPax() {
		if (state.adult + state.child > maxPax) {
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

	function displaySelectedText({
		adult,
		child,
		infant
	}: Pick<PaxNumberState, 'adult' | 'child' | 'infant'>) {
		let text = adult + ' Adult';
		if (child > 0) {
			text += `, ${child} Child`;
		}

		if (infant > 0) {
			text += `, ${infant} Infant`;
		}
		return text;
	}

	function reset() {
		state.adult = 1;
		state.child = 0;
		state.infant = 0;
	}

	return {
		state,
		closeAndFocusTrigger,
		reset,
		displaySelectedText,
		adultChange,
		childChange,
		infantChange
	};
}
