import type { Airport } from '$lib/types/Airport';

export type GroupedAirport = {
	parent: Airport | null;
	children: Airport[];
};

export type SelectAirportState = {
	isOpenList: boolean;
	airports: Airport[];
	groupedAirports: Record<string, GroupedAirport>;
	displayedAirports: GroupedAirport[];
	filteredAirports: GroupedAirport[];
	keyword: string;
	limit: number;
	offset: number;
	loading: boolean;
	searchTimeout: NodeJS.Timeout | null;
	triggerRef: HTMLButtonElement;
};
