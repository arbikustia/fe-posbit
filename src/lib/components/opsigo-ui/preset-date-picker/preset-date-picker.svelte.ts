import type { DateRange } from 'bits-ui';
import { presets } from './preset';
import dayjs from 'dayjs';

type PresetDatePickerState = {
	open: boolean;
	internalValue: DateRange;
	selectedPreset?: string;
};

export function usePresetDatePicker() {
	const state = $state<PresetDatePickerState>({
		open: false,
		internalValue: presets[0].value,
		selectedPreset: 'today'
	});

	function getSelectedPresetLabel() {
		if (state.selectedPreset === 'per-week') {
			return 'Per Week';
		}

		if (state.selectedPreset === 'by-month') {
			return 'By Month';
		}

		return presets.find((item) => item.id === state.selectedPreset)?.label ?? 'Custom';
	}

	function formatValueToLabel() {
		if (state.internalValue.start && state.internalValue.end) {
			const startDate = dayjs(state.internalValue.start?.toString());
			const endDate = dayjs(state.internalValue.end?.toString());
			const dayDiff = endDate.diff(startDate, 'day');

			if (dayDiff > 0) {
				return `${startDate.format('ddd, DD MMM YYYY')} - ${endDate.format('ddd, DD MMM YYYY')} (${dayDiff} days)`;
			}

			return `${startDate.format('ddd, DD MMM YYYY')} - ${endDate.format('ddd, DD MMM YYYY')}`;
		}

		if (state.internalValue.start) {
			return dayjs(state.internalValue.start?.toString()).format('ddd, DD MMM YYYY');
		}

		return '-';
	}

	return {
		state,
		getSelectedPresetLabel,
		formatValueToLabel
	};
}
