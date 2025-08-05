import type { DateValue, CalendarDate } from '@internationalized/date';
import type { PopoverContentProps } from 'bits-ui';

export type DatePickerState = {
	dtValue: DateValue | undefined;
	placeholder: CalendarDate;
	open: boolean;
	isInitOpen: boolean;
};

export type DatePickerProps = {
	value?: string;
	minValue?: string;
	maxValue?: string;
	otherDate?: string;
	disabled?: boolean;
	positionCalendar?: PopoverContentProps['align'];
	class?: string;
	triggerClass?: string;
	iconClass?: string;
};
