import type { SearchFlightParam, Route } from '$lib/types/SearchFlightParam';
import { page } from '$app/state';
import type { FlightResponse, ScheduleResult, Trip } from '$lib/types/FlightResponse';
import { flightTimeFilterDefaultOptions } from '$lib/constants/flight';
import { isTimeInRange } from './date-helper';
import { goto } from '$app/navigation';
import { localStorageKey } from '$lib/constants/local-storage';
import type { Company } from '$lib/types/Company';
import localStorageHelper from './local-storage-helper';
import type { Airport } from '$lib/types/Airport';
import type { FilterByTransit } from '$lib/stores/flightStore';

type FlightQueryParam = {
	com: string;
	px: string;
	mc?: string;
	rt?: string;
	dt?: string;
	prv?: string;
};

export function redirectToSearchFlight(searchModel: SearchFlightParam) {
	const queryParam: FlightQueryParam = {
		com: searchModel.companyCode,
		px: `${searchModel.adult}.${searchModel.child}.${searchModel.infant}`
	};
	const rt = searchModel.route;

	if (rt) {
		queryParam.rt = `${rt.origin}.${rt.destination}`;
		if (searchModel.flightType == 'oneway') {
			queryParam.dt = rt.departureDate;
		} else if (searchModel.flightType == 'roundtrip') {
			queryParam.dt = `${rt.departureDate}.${rt.returnDate}`;
		}
	}
	if (searchModel.flightType == 'multicity' && searchModel.multicityRoutes) {
		queryParam.mc = searchModel.multicityRoutes
			.map((flight) => `${flight.origin}.${flight.destination}.${flight.departureDate}`)
			.join('_');
	}

	queryParam.prv = searchModel.preferredProviders.join('.');

	const params = new URLSearchParams(queryParam);

	if (searchModel.preferredProviders.length == 0) params.delete('prv');
	if (searchModel.flightType == 'multicity') {
		params.delete('rt');
		params.delete('dt');
	} else {
		params.delete('mc');
	}

	const paramStr = params.toString();
	goto(`/flight/search?${paramStr}`);
}

export function convertUrlParamToSearchFlightParam(): SearchFlightParam {
	// load from url parameter string
	const searchParam = Object.fromEntries(page.url.searchParams) as FlightQueryParam;

	// default
	const result: SearchFlightParam = {
		adult: 1,
		child: 0,
		infant: 0,
		companyCode: '',
		preferredProviders: [],
		flightType: 'oneway'
	};

	// base param
	if (searchParam && searchParam.px) {
		const paxSplit = searchParam.px.split('.');
		result.adult = Number(paxSplit[0]);
		result.child = Number(paxSplit[1]);
		result.infant = Number(paxSplit[2]);
		result.companyCode = searchParam.com;

		if (searchParam.prv) result.preferredProviders = searchParam.prv.split('.').map(Number);
	}

	if (searchParam && searchParam.dt && searchParam.rt) {
		const route: Route = { origin: '', destination: '', departureDate: '', returnDate: '' };
		// departure date - return date - flight type
		const dateSplit = searchParam.dt.split('.');
		route.departureDate = dateSplit[0];
		if (dateSplit.length == 1) {
			result.flightType = 'oneway';
			route.returnDate = dateSplit[0];
		} else {
			result.flightType = 'roundtrip';
			route.returnDate = dateSplit[1];
		}

		// origin - destination
		const routeSplit = searchParam.rt.split('.');
		route.origin = routeSplit[0];
		route.destination = routeSplit[1];

		result.route = route;
	} else if (searchParam && searchParam.mc) {
		result.flightType = 'multicity';
		const multiCitySplits = searchParam.mc.split('_');
		const routes: Route[] = [];
		multiCitySplits.forEach((routeRaw) => {
			const routeSplit = routeRaw.split('.');
			routes.push({
				origin: routeSplit[0],
				destination: routeSplit[1],
				departureDate: routeSplit[2]
			});
		});

		result.multicityRoutes = routes;
	}

	return result;
}

type FilterAirlineOptions = {
	code: string;
	name: string;
	image: string;
	lowestFare: number;
	currencyCode: string;
};

export function createFilterAirlineOptions(flightResponse: FlightResponse[]) {
	const filterOptions: Map<string, FilterAirlineOptions>[] = [];
	flightResponse[0]?.schedules?.forEach(() => {
		filterOptions.push(new Map<string, FilterAirlineOptions>());
	});

	flightResponse.forEach((provider) => {
		provider.schedules.forEach((schedule, scheduleIdx) => {
			schedule.trips.forEach((trip) => {
				const carrier = trip.platingCarrier;
				const lowestFare =
					trip.classes?.reduce((min, c) => Math.min(min, c.fare.total), Infinity) || 0;

				if (carrier) {
					if (!filterOptions[scheduleIdx].has(carrier.code)) {
						filterOptions[scheduleIdx].set(carrier.code, {
							code: carrier.code,
							name: carrier.name,
							image: carrier.image,
							lowestFare,
							currencyCode: provider?.regionFormat?.currencyCode
						});
					} else {
						const existingCarrier = filterOptions[scheduleIdx].get(carrier.code)!;
						existingCarrier.lowestFare = Math.min(existingCarrier.lowestFare, lowestFare);
					}
				}
			});
		});
	});

	return filterOptions.map((item) => Array.from(item.values()));
}

type TripTimeKey = keyof Pick<Trip, 'departureDateTime' | 'arrivalDateTime'>;

export type FilterFlightTimeOptions = {
	key: string;
	title: string;
	from: number;
	to: number;
	disabled: boolean;
};

export function createFilterFlightTimeOptions(
	flightResponse: FlightResponse[],
	tripTimeKey: TripTimeKey
): FilterFlightTimeOptions[][] {
	const filterOptions: Set<string>[] = [];

	flightResponse[0].schedules.forEach(() => {
		filterOptions.push(new Set<string>());
	});

	flightResponse.forEach((provider) => {
		provider.schedules.forEach((schedule, scheduleIdx) => {
			schedule.trips.forEach((trip) => {
				filterOptions[scheduleIdx].add(
					JSON.stringify({
						hour: trip[tripTimeKey].hour,
						minute: trip[tripTimeKey].minute
					})
				);
			});
		});
	});

	const finallizeFilterOptions = filterOptions.map((item) => {
		const availableTimes = Array.from(item)
			.map((time) => JSON.parse(time))
			.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
		return flightTimeFilterDefaultOptions.map((option) => {
			const isAvailable = availableTimes.some((time) =>
				isTimeInRange(time, option.from, option.to)
			);
			return { ...option, disabled: !isAvailable };
		});
	});

	return finallizeFilterOptions;
}

type FilterTransitLocation = {
	airportCode: string;
	cityName: string;
};

export function createFilterTransitOptions(flightResponse: FlightResponse[]) {
	const filterOptions = {
		isDirect: false,
		isSingleTransit: false,
		isMultipleTransit: false,
		maxTransitDuration: 0,
		transitLocations: [] as FilterTransitLocation[]
	};

	// Use a Map to efficiently store and retrieve unique transit locations by airport code.
	const uniqueTransitLocations = new Map<string, FilterTransitLocation>();
	let maxHours = 0;

	// Iterate through all responses, schedules, and trips to gather data.
	for (const response of flightResponse) {
		if (!response?.schedules) continue;

		for (const schedule of response.schedules) {
			for (const trip of schedule.trips) {
				const segmentCount = trip.segments.length;

				// Determine the type of flight based on the number of segments.
				if (segmentCount === 1) {
					filterOptions.isDirect = true;
				} else if (segmentCount === 2) {
					filterOptions.isSingleTransit = true;
				} else if (segmentCount > 2) {
					filterOptions.isMultipleTransit = true;
				}

				// Process transits for trips with more than one segment.
				if (segmentCount > 1) {
					// A transit occurs at the destination of each segment except the last one.
					for (let i = 0; i < segmentCount; i++) {
						const segment = trip.segments[i];

						// Calculate the maximum transit duration in hours.
						// The transitTime string is like "01:00:00". We extract the hour part.
						if (segment.transitTime) {
							const currentHours = parseInt(segment.transitTime.split(':')[0]);
							if (currentHours > maxHours) {
								maxHours = currentHours;
							}
						}

						if (i > 0) {
							// Collect unique transit locations.
							const transitDestination = segment.origin;
							const locationKey = transitDestination.airport.code;

							// Add the location to the map if it's not already present.
							if (!uniqueTransitLocations.has(locationKey)) {
								uniqueTransitLocations.set(locationKey, {
									airportCode: transitDestination.airport.code,
									cityName: transitDestination.city.name
								});
							}
						}
					}
				}
			}
		}
	}

	// Set the max transit duration by adding 1 to the highest hour found.
	if (maxHours > 0) {
		filterOptions.maxTransitDuration = maxHours + 1;
	}

	// Convert the Map values to an array for the final list of transit locations.
	filterOptions.transitLocations = Array.from(uniqueTransitLocations.values());

	return filterOptions;
}

export function getDepartureArrivalLabel(schedule: ScheduleResult) {
	return `${schedule.origin.city.name} (${schedule.origin.airport.code}) → ${
		schedule.destination.city.name
	} (${schedule.destination.airport.code})`;
}

export function getCompanyName(companyCode: string) {
	// sementara ngambil dari localstorage dulu
	const companies = localStorageHelper.getItem<Company[]>(localStorageKey.autoComplete.company);

	return companies?.find((company) => company.code === companyCode)?.name;
}

export function getAirportName(airportCode: string) {
	// sementara ngambil dari localstorage dulu
	const airports = localStorageHelper.getItem<Airport[]>(localStorageKey.autoComplete.airport);

	return airports?.find((airport) => airport.airportCode === airportCode)?.cityName;
}

export function transitDisplay(transitCount: Number) {
	if (transitCount == 0) {
		return 'Direct';
	}
	return transitCount + ' stop';
}

export function displayPassengerDetail({
	adult,
	child,
	infant
}: {
	adult: number;
	child: number;
	infant: number;
}) {
	const adultText = adult > 0 ? `${adult} Adult` : '';
	const childText = child > 0 ? ` ∙ ${child} Child` : '';
	const infantText = infant > 0 ? ` ∙ ${infant} Infant` : '';
	return adultText + childText + infantText;
}

export function saveLastSearchFligth(searchModel: SearchFlightParam) {
	const lastSearches =
		localStorageHelper.getItem<SearchFlightParam[]>(localStorageKey.flight.lastSearch) ?? [];

	const searchData: SearchFlightParam = {
		...searchModel,
		multicityRoutes:
			searchModel.flightType === 'multicity' ? searchModel.multicityRoutes : undefined,
		route: searchModel.flightType !== 'multicity' ? searchModel.route : undefined
	};

	const filteredLastSearches = lastSearches.filter(
		(obj) => JSON.stringify(obj) !== JSON.stringify(searchData)
	);

	filteredLastSearches.push(searchData);

	localStorageHelper.setItem(localStorageKey.flight.lastSearch, filteredLastSearches);
}

function parseTransitTimeToHours(timeString: string): number {
	if (!timeString || !timeString.includes(':')) {
		return 0;
	}

	const parts = timeString.split(':');
	if (parts.length < 2 || parts.length > 3) {
		return 0; // Invalid format
	}

	const hours = parseInt(parts[0], 10) || 0;
	const minutes = parseInt(parts[1], 10) || 0;
	const seconds = parts[2] ? parseInt(parts[2], 10) : 0;

	return hours + minutes / 60 + seconds / 3600;
}

export function filterSchedulesByTransit(trips: Trip[], filters: FilterByTransit): Trip[] {
	// If no specific filters are applied, return the original list.
	const noTypeFilter = !filters.isDirect && !filters.isSingleTransit && !filters.isMultipleTransit;
	const noDurationFilter =
		!filters.durations || (filters.durations[0] === 0 && filters.durations[1] === 0);
	const noLocationFilter = !filters.locations || filters.locations.length === 0;

	if (noTypeFilter && noDurationFilter && noLocationFilter) {
		return trips;
	}

	const matchingTrips = trips.filter((trip) => {
		// 1. Check Transit Type (Direct, Single, Multiple)
		let typeMatch = false;
		if (noTypeFilter) {
			typeMatch = true; // If no type filter is set, all types match.
		} else {
			if (filters.isDirect && trip.transitCount === 0) typeMatch = true;
			if (filters.isSingleTransit && trip.transitCount === 1) typeMatch = true;
			if (filters.isMultipleTransit && trip.transitCount > 1) typeMatch = true;
		}
		if (!typeMatch) return false; // Exit early if type doesn't match

		// 2. Check Transit Duration
		let durationMatch = false;
		if (noDurationFilter) {
			durationMatch = true; // If no duration filter, it's a match.
		} else {
			const totalTransitHours = trip.segments.reduce(
				(total, segment) => total + parseTransitTimeToHours(segment.transitTime),
				0
			);

			if (
				totalTransitHours >= (filters?.durations?.[0] ?? 0) &&
				totalTransitHours <= (filters?.durations?.[1] ?? 0)
			) {
				durationMatch = true;
			}
		}

		if (!durationMatch) return false; // Exit early if duration doesn't match

		// 3. Check Transit Locations
		let locationMatch = false;
		if (noLocationFilter) {
			locationMatch = true; // If no location filter, it's a match.
		} else {
			const tripTransitLocations = trip.segments
				.slice(0, -1) // Get all segments that precede a transit
				.map((segment) => segment.destination.airport.code);

			// Check if any of the trip's transit locations are in the filter list
			if (tripTransitLocations.some((loc) => filters.locations.includes(loc))) {
				locationMatch = true;
			}
		}
		if (!locationMatch) return false; // Exit early if location doesn't match

		// If all checks passed, include the trip
		return true;
	});

	return matchingTrips;
}
