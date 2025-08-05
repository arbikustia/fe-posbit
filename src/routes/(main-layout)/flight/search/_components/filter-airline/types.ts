export type FilterAirlineProps = {
	currentScheduleIdx: number;
};

export type FilterAirlineState = {
	selectedValues: string[];
	open: boolean;
	triggerRef: HTMLButtonElement;
};
