import { goto } from '$app/navigation';
import localStorageHelper from './local-storage-helper';
import { localStorageKey } from '$lib/constants/local-storage';
import { page } from '$app/state';
import type { Route } from '$lib/types/SearchFlightParam';
import dayjs from 'dayjs';

interface InsuranceQueryParam {
	it?: string;
	com?: string;
	tm?: string;
	gt?: string;
	px?: string;
	ca?: string;
	oc?: string;
	dc?: string;
	cd?: string;
	dsd?: string;
	ded?: string;
	csd?: string;
	ced?: string;
	cp?: string;
}

interface SearchInsuranceParam {
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
}

export function redirectToSearchInsurance(searchModel: SearchInsuranceParam) {
	console.log('searchModel', searchModel);
	if (searchModel.insuranceType == 'travel-insurance') {
		const internationalParam: InsuranceQueryParam = {
			ca: searchModel.coverageArea,
			oc: searchModel.originCountry,
			dc: searchModel.destinationCountry,
			cd: `${searchModel.coverageDate.start}.${searchModel.coverageDate.end}`
		};
		const domesticParam: InsuranceQueryParam = {
			ca: searchModel.coverageArea,
			dsd: searchModel.domesticStartDate,
			ded: searchModel.domesticEndDate
		};
		const queryParam: any = {
			it: searchModel.insuranceType,
			com: searchModel.companyCode,
			tm: searchModel.tripMode,
			gt: searchModel.groupType,
			px: `${searchModel.adult}.${searchModel.child}`
		};
		if (searchModel.coverageArea == 'international') {
			const resultQueryParam = {
				...queryParam,
				...internationalParam
			};

			const params = new URLSearchParams(resultQueryParam);

			const paramStr = params.toString();
			goto(`/insurance/search?${paramStr}`);
		} else {
			const resultQueryParam = {
				...queryParam,
				...domesticParam
			};

			const params = new URLSearchParams(resultQueryParam);

			const paramStr = params.toString();
			goto(`/insurance/search?${paramStr}`);
		}
	} else {
		const queryParam = {
			it: searchModel.insuranceType,
			com: searchModel.companyCode,
			cp: searchModel.coverageperiod,
			csd: searchModel.coverageStartDate,
			ced: searchModel.coverageEndDate
		};

		const params = new URLSearchParams(queryParam);

		const paramStr = params.toString();
		goto(`/insurance/search?${paramStr}`);
	}
}

export function saveLastSearchInsurance(searchModel: SearchInsuranceParam) {
	const lastSearches =
		localStorageHelper.getItem<any[]>(localStorageKey.insurance.lastSearch) ?? [];

	const searchData: any = {
		...searchModel
	};

	const filteredLastSearches = lastSearches.filter(
		(obj) => JSON.stringify(obj) !== JSON.stringify(searchData)
	);

	filteredLastSearches.push(searchData);

	localStorageHelper.setItem(localStorageKey.insurance.lastSearch, filteredLastSearches);
}

export function convertUrlParamToSearchInsuranceParam(): SearchInsuranceParam {
	const searchParam = Object.fromEntries(page.url.searchParams) as InsuranceQueryParam;

	const result: SearchInsuranceParam = {
		insuranceType: 'travel-insurance',
		companyCode: '',
		tripMode: 'single trip',
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
		coverageEndDate: dayjs().add(60, 'day').format('YYYY-MM-DD')
	};

	if (searchParam && searchParam.px) {
		const [adult, child] = searchParam.px.split('.');
		(result.adult = parseInt(adult)), (result.child = parseInt(child));
	}
	if (searchParam && searchParam.cd) {
		const [start, end] = searchParam.cd.split('.');
		result.coverageDate.start = start;
		result.coverageDate.end = end;
		console.log(start, end, 'cd testing')
	}
	if (searchParam && searchParam.it) {
		result.insuranceType = searchParam.it;
	}
	if (searchParam && searchParam.com) {
		result.companyCode = searchParam.com;
	}
	if (searchParam && searchParam.tm) {
		result.tripMode = searchParam.tm;
	}
	if (searchParam && searchParam.ca) {
		result.coverageArea = searchParam.ca;
	}
	if (searchParam && searchParam.oc) {
		result.originCountry = searchParam.oc;
	}
	if (searchParam && searchParam.dc) {
		result.destinationCountry = searchParam.dc;
	}
	if (searchParam && searchParam.gt) {
		result.groupType = searchParam.gt;
	}
	if (searchParam && searchParam.dsd) {
		result.domesticStartDate = searchParam.dsd;
	}
	if (searchParam && searchParam.ded) {
		result.domesticEndDate = searchParam.ded;
	}
	if (searchParam && searchParam.cp) {
		result.coverageperiod = searchParam.cp;
	}
	if (searchParam && searchParam.csd) {
		result.coverageStartDate = searchParam.csd;
	}
	if (searchParam && searchParam.ced) {
		result.coverageEndDate = searchParam.ced;
	}

	return result;
}
