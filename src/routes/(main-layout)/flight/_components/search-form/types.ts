import type { Route, SearchFlightParam } from '$lib/types/SearchFlightParam';
import type { HTMLAttributes } from 'svelte/elements';

export type MulticityRouteErrorForm = {
	field: 'origin' | 'destination';
	message: string;
};

export type SearchFormValidation = {
	isInvalidRoute: boolean;
	isInvalidCompany: boolean;
	invalidRoutes: MulticityRouteErrorForm[];
};

export type SearchFormProps = {
	isLoading?: boolean;
	onSubmitCallback?: () => void;
};

export type SearchFormState = {
	searchModel: SearchFlightParam;
	validation: SearchFormValidation;
	isSubmitted: boolean;
};

export type SearchFormOneWayRoundtripProps = {
	route: Route;
	flightType: SearchFlightParam['flightType'];
	isInvalidRoute: SearchFormValidation['isInvalidRoute'];
	airportSelectWrapperClass?: HTMLAttributes<HTMLDivElement>['class'];
	dateSelectWrapperClass?: HTMLAttributes<HTMLDivElement>['class'];
	showLabel?: boolean;
	class?: HTMLAttributes<HTMLDivElement>['class'];
	variant?:string
};

export type SearchFormMultiCityProps = {
	routes: Route[];
	invalidRoutes: SearchFormValidation['invalidRoutes'];
	removeFlight: (idx: number) => void;
	class?: HTMLAttributes<HTMLDivElement>['class'];
	removeBtnClass?: HTMLAttributes<HTMLDivElement>['class'];
	variant?:string
};
