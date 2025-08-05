export type FilterTimeProps = {
	currentScheduleIdx: number;
};

export type FilterTimeState = {
	selectedDepartureTimes: string[];
	selectedArrivalTimes: string[];
	open: boolean;
	triggerRef: HTMLButtonElement;
};
