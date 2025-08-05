import { goto } from '$app/navigation';
import { page } from '$app/state';
import { localStorageKey } from '$lib/constants/local-storage';
import type { Route, SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
import localStorageHelper from './local-storage-helper';

type TrainQueryParam = {
	type: string;
	com: string;
	px: string;
	rt?: string;
	dt?: string;
	prv?: string;
};

export function redirectToSearchTrain(searchModel: SearchTrainParam) {
	const queryParam: TrainQueryParam = {
		com: searchModel.companyCode,
		px: `${searchModel.adult}.${searchModel.infant}`,
		type: searchModel.trainType
	};
	const rt = searchModel.route;

	if (rt) {
		queryParam.rt = `${rt.origin}.${rt.destination}`;
		if (searchModel.tripType == 'oneway') {
			queryParam.dt = rt.departureDate;
		} else if (searchModel.tripType == 'roundtrip') {
			queryParam.dt = `${rt.departureDate}.${rt.returnDate}`;
		}
	}

	const params = new URLSearchParams(queryParam);

	const paramStr = params.toString();
	goto(`/train/search?${paramStr}`);
}

export function convertUrlParamToSearchTrainParam(): SearchTrainParam {
	// load from url parameter string
	const searchParam = Object.fromEntries(page.url.searchParams) as TrainQueryParam;

	// default
	const result: SearchTrainParam = {
		adult: 1,
		infant: 0,
		companyCode: '',
		tripType: 'oneway',
		trainType: 'kai'
	};

	// base param
	if (searchParam && searchParam.px) {
		const paxSplit = searchParam.px.split('.');
		result.adult = Number(paxSplit[0]);
		result.infant = Number(paxSplit[1]);
		result.companyCode = searchParam.com;
		result.trainType = searchParam.type;
	}

	if (searchParam && searchParam.dt && searchParam.rt) {
		const route: Route = { origin: '', destination: '', departureDate: '', returnDate: '' };
		// departure date - return date - trip type
		const dateSplit = searchParam.dt.split('.');
		route.departureDate = dateSplit[0];
		if (dateSplit.length == 1) {
			result.tripType = 'oneway';
			route.returnDate = dateSplit[0];
		} else {
			result.tripType = 'roundtrip';
			route.returnDate = dateSplit[1];
		}

		// origin - destination
		const routeSplit = searchParam.rt.split('.');
		route.origin = routeSplit[0];
		route.destination = routeSplit[1];

		result.route = route;
	}
	return result;
}

export function displayPassengerDetail({ adult, infant }: { adult: number; infant: number }) {
	const adultText = adult > 0 ? `${adult} Adult` : '';
	const infantText = infant > 0 ? ` ∙ ${infant} Infant` : '';
	return adultText + infantText;
}

export function saveLastSearchTrain(searchModel: SearchTrainParam) {
	const lastSearches =
		localStorageHelper.getItem<SearchTrainParam[]>(localStorageKey.train.lastSearch) ?? [];

	const searchData: SearchTrainParam = {
		...searchModel
	};

	const filteredLastSearches = lastSearches.filter(
		(obj) => JSON.stringify(obj) !== JSON.stringify(searchData)
	);

	filteredLastSearches.push(searchData);

	localStorageHelper.setItem(localStorageKey.train.lastSearch, filteredLastSearches);
}
