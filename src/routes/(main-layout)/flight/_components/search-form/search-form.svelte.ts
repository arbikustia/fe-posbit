import {
	convertUrlParamToSearchFlightParam,
	redirectToSearchFlight,
	saveLastSearchFligth
} from '$lib/helpers/search-flight-helper';
import dayjs from 'dayjs';
import { onMount } from 'svelte';
import type { MulticityRouteErrorForm, SearchFormProps, SearchFormState } from './types';
import {
	ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION,
	VALIDATION_ALERT_SHOW_DURATION
} from './constants';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import { localStorageKey } from '$lib/constants/local-storage';
import type { SearchFlightParam } from '$lib/types/SearchFlightParam';

export const defaultRoute = {
	origin: 'CGK',
	destination: 'SIN',
	departureDate: dayjs().format('YYYY-MM-DD'),
	returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD')
};

const defaultMultiCityRoutes = [
	{
		origin: 'CGK',
		destination: 'DPS',
		departureDate: dayjs().format('YYYY-MM-DD')
	},
	{
		origin: 'DPS',
		destination: 'CGK',
		departureDate: dayjs().add(1, 'day').format('YYYY-MM-DD')
	}
];

export function useSearchForm() {
	const state = $state<SearchFormState>({
		searchModel: {
			flightType: 'oneway',
			companyCode: '',
			adult: 1,
			child: 0,
			infant: 0,
			preferredProviders: [],
			route: defaultRoute,
			multicityRoutes: defaultMultiCityRoutes
		},
		validation: {
			isInvalidRoute: false,
			isInvalidCompany: false,
			invalidRoutes: []
		},
		isSubmitted: false
	});

	function showAlertOriginDestination() {
		if (state.validation.isInvalidRoute) return;
		state.validation.isInvalidRoute = true;
		setTimeout(() => {
			state.validation.isInvalidRoute = false;
		}, VALIDATION_ALERT_SHOW_DURATION);
	}

	function showAlertCompanySelect() {
		if (state.validation.isInvalidCompany) return;
		state.validation.isInvalidCompany = true;
		setTimeout(() => {
			state.validation.isInvalidCompany = false;
		}, VALIDATION_ALERT_SHOW_DURATION);
	}

	function showAlertMulticityForm(errors: MulticityRouteErrorForm[]) {
		state.validation.invalidRoutes = errors;
		setTimeout(() => {
			state.validation.invalidRoutes = [];
		}, VALIDATION_ALERT_SHOW_DURATION);
	}

	function getMulticityRouteErrors() {
		const { multicityRoutes } = state.searchModel;

		const errors: MulticityRouteErrorForm[] = [];
		multicityRoutes?.forEach((route, i) => {
			if (errors.length < 1) {
				if (!route.origin || !route.destination) {
					errors[i] = {
						field: !route.origin ? 'origin' : 'destination',
						message: `${!route.origin ? 'Origin' : 'Destination'} field is required`
					};
				} else if (route.origin === route.destination) {
					errors[i] = {
						field: 'destination',
						message: ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION
					};
				}
			}
		});

		return errors;
	}

	function submitSearch(onSubmitCallback: SearchFormProps['onSubmitCallback']) {
		const { companyCode, route, flightType } = state.searchModel;

		if (!companyCode) {
			showAlertCompanySelect();
			return;
		}

		if (flightType === 'multicity') {
			const errors = getMulticityRouteErrors();
			if (errors.length > 0) {
				showAlertMulticityForm(errors);
				return;
			}
		}

		if (flightType === 'oneway' || flightType === 'roundtrip') {
			if (route?.origin === route?.destination) {
				showAlertOriginDestination();
				return;
			}
		}

		state.isSubmitted = true;
		saveLastSearchFligth(state.searchModel);
		redirectToSearchFlight(state.searchModel);

		// use timeout for waiting search param update
		setTimeout(() => {
			onSubmitCallback?.();
		});

		state.isSubmitted = false;
	}

	function addFlight() {
		state.searchModel.multicityRoutes?.push({
			origin: '',
			destination: '',
			departureDate: dayjs()
				.add(state.searchModel.multicityRoutes?.length, 'day')
				.format('YYYY-MM-DD')
		});
	}

	function removeFlight(idx: number) {
		state.searchModel.multicityRoutes?.splice(idx, 1);
	}

	onMount(() => {
		const searchFlightParam = convertUrlParamToSearchFlightParam();
		state.searchModel = {
			...searchFlightParam,
			route: searchFlightParam.route || defaultRoute,
			multicityRoutes: searchFlightParam.multicityRoutes || defaultMultiCityRoutes
		};
	});

	// scroll into invalid form
	$effect(() => {
		const { isInvalidCompany, isInvalidRoute, invalidRoutes } = state.validation;
		if (isInvalidCompany || isInvalidRoute || invalidRoutes.length > 0) {
			if (typeof document !== undefined) {
				document.querySelector('.validation-alert')?.scrollIntoView({
					block: 'center',
					behavior: 'smooth'
				});
			}
		}
	});

	return { state, submitSearch, addFlight, removeFlight };
}
