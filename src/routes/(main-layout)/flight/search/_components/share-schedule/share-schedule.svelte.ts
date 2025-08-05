import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
import { formatThousand } from '$lib/helpers/number-helper';
import type { DateTime, Trip } from '$lib/types/FlightResponse';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
import { copyToClipboard, webShare } from '$lib/utils';
import type { ShareScheduleState } from './types';

export function useShareSchedule() {
	const state = $state<ShareScheduleState>({
		selectedTrips: []
	});

	function getScheduleName(
		flightType: SearchFlightParam['flightType'],
		currentScheduleIdx: number
	) {
		if (flightType === 'multicity') {
			return `Flight ${currentScheduleIdx + 1}`;
		}

		if (currentScheduleIdx > 0) {
			return 'Return';
		}

		return 'Departure';
	}

	function handleSelectTrip(trip: Trip) {
		const hasSelected = !!state.selectedTrips.find((item) => item.key === trip.key);

		if (hasSelected) {
			state.selectedTrips = state.selectedTrips.filter((item) => item.key !== trip.key);
		} else {
			state.selectedTrips = [...state.selectedTrips, trip];
		}
	}

	function handleSelectAllTrip(trips: Trip[]) {
		if (state.selectedTrips.length === trips.length) {
			state.selectedTrips = [];
		} else {
			state.selectedTrips = trips;
		}
	}

	function copySimpleFormat(useShareApi = false) {
		let text = '';
		state.selectedTrips.forEach((trip) => {
			const tripClass = trip.classes[0];
			trip.segments.forEach((segment) => {
				const carrier = segment.marketingCarrier;
				text += `${carrier.name} ${carrier.code} ${carrier.flightNumber}, ${segment.origin.airport.code} (${displayTime(segment.departureDateTime)}) - ${segment.destination.airport.code} (${displayTime(segment.arrivalDateTime)}), ${tripClass.bookingClass} - ${formatThousand(tripClass.fare.total)}`;
				text += '\n';
			});
			text += '\n';
		});

		if (useShareApi) {
			webShare({
				title: 'Flight Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	function copyRegularFormat(route: string, departureDateTime: DateTime, useShareApi = false) {
		let text = `Flight Schedule\n${route}\nDeparture : ${displayDate(departureDateTime, 'ddd, DD MMMM YYYY')}\n\n${state.selectedTrips.length} flights found\n\n`;

		state.selectedTrips.forEach((trip, tripIdx) => {
			const tripClass = trip.classes[0];
			text += `Option #${tripIdx + 1}\n`;
			trip.segments.forEach((segment) => {
				const carrier = segment.marketingCarrier;
				if (segment.transitTime) {
					text += `Transit ${formatTimeSpan(segment.transitTime)}` + '\n';
				}
				text += `${carrier.name} ${carrier.code} ${carrier.flightNumber}\n${segment.origin.airport.code} (${displayTime(segment.departureDateTime)}) - ${segment.destination.airport.code} (${displayTime(segment.arrivalDateTime)}) • ${formatTimeSpan(segment.flightTime)}\n${tripClass.cabinClass} = ${formatThousand(tripClass.fare.total)} ${tripClass.fare.currency}`;
				text += '\n';
			});
			text += '\n';
		});

		if (useShareApi) {
			webShare({
				title: 'Flight Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	function copyFormattedFormat(route: string, departureDateTime: DateTime, useShareApi = false) {
		let text = `*Flight Schedule*\n${route}\nDeparture : ${displayDate(departureDateTime, 'ddd, DD MMMM YYYY')}\n\n_${state.selectedTrips.length} flights found_\n\n`;

		state.selectedTrips.forEach((trip, tripIdx) => {
			const tripClass = trip.classes[0];
			text += `*Option #${tripIdx + 1}*\n`;
			trip.segments.forEach((segment) => {
				const carrier = segment.marketingCarrier;
				if (segment.transitTime) {
					text += ` \`\`\`--- Transit\`\`\` _${formatTimeSpan(segment.transitTime)}_` + '\n';
				}
				text += `${carrier.name} ${carrier.code} ${carrier.flightNumber}\n${segment.origin.airport.code} (${displayTime(segment.departureDateTime)}) - ${segment.destination.airport.code} (${displayTime(segment.arrivalDateTime)}) • _${formatTimeSpan(segment.flightTime)}_\n${tripClass.cabinClass} = *${formatThousand(tripClass.fare.total)} ${tripClass.fare.currency}*`;
				text += '\n';
			});
			text += '\n';
		});

		if (useShareApi) {
			webShare({
				title: 'Flight Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	return {
		state,
		getScheduleName,
		handleSelectTrip,
		handleSelectAllTrip,
		copySimpleFormat,
		copyRegularFormat,
		copyFormattedFormat
	};
}
