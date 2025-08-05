export type SelectRouteProps = {
	route: {
		originCountry: string;
		destinationCountry: string;
	};
	class?: string;
	isInvalidRoute: boolean;
	showLabel?: boolean;
};
