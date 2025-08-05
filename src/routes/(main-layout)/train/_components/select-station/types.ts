export type Station = {
	stationCode: string;
	stationName: string;
	cityCode: string;
	cityName: string;
	isMetropolitan: boolean;
};

export type GroupedStation = {
	parent: Station | null;
	children: Station[];
};

export type SelectStationState = {
	isOpenList: boolean;
	stations: Station[];
	groupedStations: Record<string, GroupedStation>;
	displayedStations: GroupedStation[];
	filteredStations: GroupedStation[];
	keyword: string;
	limit: number;
	offset: number;
	loading: boolean;
	searchTimeout: NodeJS.Timeout | null;
	triggerRef: HTMLButtonElement;
};
