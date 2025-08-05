import type { DateRange } from 'bits-ui';

export type Preset = {
	id: string;
	label: string;
	value: DateRange;
};

export type PresetDatePickerProps = {
	value: DateRange;
	placeholder?: string;
	triggerClass?: string;
};
