import {
	convertUrlParamToSearchInsuranceParam,
	redirectToSearchInsurance,
	saveLastSearchInsurance
} from '$lib/helpers/search-insurance-helper';
import { Inspect } from '@lucide/svelte';
import dayjs from 'dayjs';
import { onMount } from 'svelte';

export type SearchModel = {
	insuranceType: string;
	companyCode: string;
	tripMode: string;
	groupType: string;
	adult: number;
	child: number;
	coverageArea: string;
	originCountry: string;
	destinationCountry: string;
	coverageDate: {
		start: string,
		end: string
	},
	domesticStartDate: string;
	domesticEndDate: string;
	coverageperiod: string;
	coverageStartDate: string;
	coverageEndDate: string;
};

type SearchFormValidation = {
	isInvalidRoute: boolean;
	isInvalidCompany: boolean;
};

type SelectTripState = {
	searchModel: SearchModel;
	isOpenList: boolean;
	isSubmitted: boolean;
	displayedItems: any[];
	triggerRef: HTMLButtonElement | null;
	validation: SearchFormValidation;
};

const dataOption = [
	{ value: 'Single Trip', label: 'Single Trip' },
	{ value: 'Round Trip', label: 'Round Trip' },
	{ value: 'One Way', label: 'One Way' },
	{ value: 'Annual', label: 'Annual' }
];

export function useSearchForm() {
	let state = $state<SelectTripState>({
		searchModel: {
			insuranceType: 'travel-insurance',
			companyCode: '',
			tripMode: 'Single Trip',
			groupType: 'Individual',
			adult: 0,
			child: 0,
			coverageArea: 'international',
			originCountry: 'indonesia',
			destinationCountry: 'singapore',
			coverageDate: {
				start: dayjs().format('YYYY-MM-DD'),
				end: dayjs().add(0, 'day').format('YYYY-MM-DD')
			},
			domesticStartDate: dayjs().format('YYYY-MM-DD'),
			domesticEndDate: dayjs().add(0, 'day').format('YYYY-MM-DD'),
			coverageperiod: '6-months',
			coverageStartDate: dayjs().format('YYYY-MM-DD'),
			coverageEndDate: dayjs().add(0, 'day').format('YYYY-MM-DD')
		},
		isSubmitted: false,
		isOpenList: false,
		displayedItems: dataOption,
		triggerRef: null,
		validation: {
			isInvalidCompany: false,
			isInvalidRoute: false
		}
	});

	function updateCoverageEndDateIfNeeded() {
		if (state.searchModel.coverageperiod === '6-months') {
			state.searchModel.coverageEndDate = dayjs(state.searchModel.coverageStartDate)
				.add(6, 'month')
				.format('YYYY-MM-DD');
		} else if (state.searchModel.coverageperiod === 'annual') {
			state.searchModel.coverageEndDate = dayjs(state.searchModel.coverageStartDate)
				.add(1, 'year')
				.format('YYYY-MM-DD');
		}
	}

	$: state.searchModel.coverageperiod, state.searchModel.coverageStartDate, updateCoverageEndDateIfNeeded();
	console.log(state.searchModel, 'testing search model 200');

	function closeAndFocusTrigger() {
		state.isOpenList = false;
	}
	function submitSearch(onSubmitCallback: any['onSubmitCallback']) {
		// Validasi dan update coverageEndDate sebelum redirect
		if (state.searchModel.coverageperiod === '6-months') {
			state.searchModel.coverageEndDate = dayjs(state.searchModel.coverageStartDate)
				.add(6, 'month')
				.format('YYYY-MM-DD');
		} else if (state.searchModel.coverageperiod === 'annual') {
			state.searchModel.coverageEndDate = dayjs(state.searchModel.coverageStartDate)
				.add(1, 'year')
				.format('YYYY-MM-DD');
		}

		console.log(state.searchModel, 'search-model 100');
		state.isSubmitted = true;
		redirectToSearchInsurance(state.searchModel);
		saveLastSearchInsurance(state.searchModel);

		setTimeout(() => {
			onSubmitCallback?.();
		});

		state.isSubmitted = false;
	}

	onMount(() => {
		const searchInsuranceParam = convertUrlParamToSearchInsuranceParam();
		state.searchModel = {
			...state.searchModel,
			...searchInsuranceParam
		};
	});

	return {
		state,
		closeAndFocusTrigger,
		submitSearch
	};
}
