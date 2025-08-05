import type { Route, SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';

export type SelectScheduleProps = {
	route: Route;
	tripType: SearchTrainParam['tripType'];
	trainType: SearchTrainParam['trainType'];
	class?: string;
	showLabel?: boolean;
	variant?:string
};
