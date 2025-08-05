export type PaxNumberState = {
	adult: number;
	child: number;
	isOpenList: boolean;
	triggerRef: HTMLButtonElement;
};

const maxPax = 7;

export function useSelectPax() {
	const state = $state<PaxNumberState>({
		adult: 0,
		child: 0,
		isOpenList: false,
		triggerRef: null!
	});

	function closeAndFocusTrigger() {
		state.isOpenList = false;
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

		if (isMaxPax()) {
			state.adult -= 1;
		}
	}

	function displaySelectedText({
		adult,
		child,
	}: Pick<PaxNumberState, 'adult' | 'child' >) {
		let text = adult + ' Adult';
		if (child > 0) {
			text += `, ${child} Child`;
		}
		return text;
	}

	function reset() {
		state.adult = 1;
		state.child = 0;
	}

	return {
		state,
		closeAndFocusTrigger,
		reset,
		displaySelectedText,
		adultChange,
		childChange,
	};
}
