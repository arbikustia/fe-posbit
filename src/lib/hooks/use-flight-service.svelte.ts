import { convertUrlParamToSearchFlightParam } from '$lib/helpers/search-flight-helper';
import { flightService } from '$lib/services/flight/flightService';
import flightStore from '$lib/stores/flightStore';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';
import citilinkDummy from '$lib/dummy/flight/search/citilink.json';
import lionDummy from '$lib/dummy/flight/search/lion.json';
import scootDummy from '$lib/dummy/flight/search/scoot.json';
import airAsiaDummy from '$lib/dummy/flight/search/airasia.json';
import garudaDummy from '$lib/dummy/flight/search/garuda.json';
import type { FlightResponse } from '$lib/types/FlightResponse';

type FlightServiceConnection = {
	id: string | undefined;
	status: 'connecting' | 'connected' | 'error';
};

type DepartureDate = {
	year: number;
	month: number;
	day: number;
};

type Route = {
	originAirport: string;
	destinationAirport: string;
	departureDate: DepartureDate;
};

type ScheduleRequestBody = {
	adult: number;
	child: number;
	infant: number;
	preferredProviders: number[];
	routes: Route[];
};

export function useFlightService() {
	let connection = $state<FlightServiceConnection>({
		id: undefined,
		status: 'connecting'
	});

	// Create signalR Connection
	const flightServiceConnection = flightService.createConnection();

	async function startConnection() {
		try {
			await flightServiceConnection.start();
			const connectionId = await flightServiceConnection.invoke('GetConnectionId');
			connection.id = connectionId;
			connection.status = 'connected';

			getSchedule();
		} catch (err) {
			connection.status = 'error';
		}
	}

	function convertSearchParamDateToDepartureDate(date: string): DepartureDate {
		const dayJsDate = dayjs(date);

		return {
			year: dayJsDate.get('year'),
			month: dayJsDate.get('month') + 1, // + 1 because day js month start from 0
			day: dayJsDate.get('date')
		};
	}

	function getScheduleRequestBody() {
		const searchFlightParam = convertUrlParamToSearchFlightParam();
		const { adult, child, infant, preferredProviders, route, multicityRoutes } = searchFlightParam;

		const body: ScheduleRequestBody = {
			adult: adult,
			child: child,
			infant: infant,
			preferredProviders: preferredProviders,
			routes: []
		};

		if (route) {
			body.routes.push({
				originAirport: route.origin,
				destinationAirport: route.destination,
				departureDate: convertSearchParamDateToDepartureDate(route.departureDate)
			});

			if (route.returnDate) {
				body.routes.push({
					originAirport: route.destination,
					destinationAirport: route.origin,
					departureDate: convertSearchParamDateToDepartureDate(route.returnDate)
				});
			}
		}

		if (multicityRoutes) {
			body.routes = multicityRoutes.map((multicityRoute) => ({
				originAirport: multicityRoute.origin,
				destinationAirport: multicityRoute.destination,
				departureDate: convertSearchParamDateToDepartureDate(multicityRoute.departureDate)
			}));
		}

		return body;
	}

	function getSchedule() {
		flightStore.reset();

		const body = getScheduleRequestBody();

		const headers = {
			'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
			'X-WebSocket-ConnectionID': connection.id
		};

		const availableProviders = ['Amadeus', 'Citilink', 'AirAsia', 'Lion'];
		flightStore.setProviders(availableProviders);
		flightServiceConnection
			.invoke('FlightAvailabilitySearch', body, headers)
			.then((response) => {
				console.log('Search started.');
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	// Callback search result
	flightServiceConnection.on('FlightAvailabilitySearch.Result', function (response) {
		console.log('FlightAvailabilitySearch.Result :');
		console.log(response);
		flightStore.addFlightResult(response);
		//addFlightResult(response);
		//const currentValue = get(flightStore);
		//console.log(currentValue);

		//availabilitySchedules.push({ provider: response.provider, schedules: response.schedules });
	});

	// Start the connection
	// onMount(() => {
	// 	startConnection();
	// });

	// onDestroy(() => {
	// 	flightServiceConnection.stop();
	// });

	// TEMP CODE WILL REMOVE LATER
	async function processWithDummy() {
		flightStore.reset();
		const providers = ['Citilink', 'Lion Air', 'Scoot', 'Air Asia', 'Garuda'];
		flightStore.setProviders(providers);
		for (const provider of providers) {
			await delay(1000);
			if (provider === 'Citilink') {
				flightStore.addFlightResult(citilinkDummy as unknown as FlightResponse);
			} else if (provider === 'Lion Air') {
				flightStore.addFlightResult(lionDummy as unknown as FlightResponse);
			} else if (provider === 'Scoot') {
				flightStore.addFlightResult(scootDummy as unknown as FlightResponse);
			} else if (provider === 'Air Asia') {
				flightStore.addFlightResult(airAsiaDummy as unknown as FlightResponse);
			} else if (provider === 'Garuda') {
				flightStore.addFlightResult(garudaDummy as unknown as FlightResponse);
			}
		}
	}

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	onMount(() => {
		processWithDummy();
	});
	//END TEMP CODE

	return {
		connection,
		getSchedule
	};
}
