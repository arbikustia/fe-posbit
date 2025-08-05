type DateItem = {
	id: number;
	date: string;
	price: string;
	available: boolean;
	isCurrent: boolean;
};

export type DateSelectorProps = {
	currentDate: string;
};

export type DateSelectorState = {
	selectedDateIdx: number;
	dates: DateItem[];
	dateContainerRef: HTMLDivElement;
};
