import { type DateValue, CalendarDate, getLocalTimeZone, parseDate } from '@internationalized/date';
import dayjs from 'dayjs';
import type { DatePickerProps, DatePickerState } from './types';

export function useDatePicker() {
	const state = $state<DatePickerState>({
		dtValue: undefined,
		placeholder: new CalendarDate(2024, 8, 3),
		open: false,
		isInitOpen: false
	});

	function getMinDtValue(minValue: string) {
		if (minValue) return parseDate(minValue);
		return undefined;
	}

	function dtFormatDisplay(date: DateValue) {
		var dateObj = date.toDate(getLocalTimeZone());
		return dayjs(dateObj).format('ddd, D MMM YY');
	}

	// set val dari selected date
	function setVal(dateVal: DateValue | undefined, setValue: (newVal: string) => void) {
		if (!dateVal) {
			return;
		}
		let newDate = dateVal.toDate(getLocalTimeZone());
		let newVal = dayjs(newDate).format('YYYY-MM-DD');

		setValue(newVal);
	}

	function setMonthView(value: DatePickerProps['value'], otherDate: string) {
		var startDateMonth = dayjs(otherDate).get('month') + 1;
		var endDateMonth = dayjs(value).get('month') + 1;
		if (startDateMonth < endDateMonth) {
			let monthView = endDateMonth - 1;
			state.placeholder = state.placeholder.set({ month: monthView });
		}
	}

	return { state, getMinDtValue, dtFormatDisplay, setVal, setMonthView };
}
