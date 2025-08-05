import type { Route } from '$lib/types/app/train/SearchTrainParam';

export type SelectRouteProps = {
	route: Route;
	class?: string;
	isInvalidRoute: boolean;
	showLabel?: boolean;
	variant?:string
};
