import dayjs from 'dayjs';
import type { SearchFormState } from './types';
import {
	convertUrlParamToSearchTrainParam,
	redirectToSearchTrain,
	saveLastSearchTrain
} from '$lib/helpers/search-train-helper';
import { onMount } from 'svelte';

const defaultRoute = {
	origin: 'GMR',
	destination: 'CMI',
	departureDate: dayjs().format('YYYY-MM-DD'),
	returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD')
};

const VALIDATION_ALERT_SHOW_DURATION = 1000;

export function useSearchForm() {
	const state = $state<SearchFormState>({
		searchModel: {
			trainType: 'kai',
			tripType: 'oneway',
			companyCode: '',
			adult: 1,
			infant: 0,
			route: defaultRoute
		},
		isSubmitted: false,
		validation: {
			isInvalidCompany: false,
			isInvalidRoute: false
		}
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

	function submitSearch() {
		const { companyCode, route } = state.searchModel;

		if (!companyCode) {
			showAlertCompanySelect();
			return;
		}

		if (route?.origin === route?.destination) {
			showAlertOriginDestination();
			return;
		}

		state.isSubmitted = true;
		saveLastSearchTrain(state.searchModel);
		redirectToSearchTrain(state.searchModel);

		state.isSubmitted = false;
	}

	onMount(() => {
		const searchFlightParam = convertUrlParamToSearchTrainParam();
		state.searchModel = {
			...searchFlightParam,
			route: searchFlightParam.route || defaultRoute
		};
	});

	return { state, submitSearch };
}
