import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const dashboardGudangService = {
	getPagedIn: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-in`, {
			params
		});
	},
	getPagedOut: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-out`, {
			params
		});
	},
	getPagedOutCustomer: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-out-cust`, {
			params
		});
	},
	getPagedNg: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-ng`, {
			params
		});
	},
	getDashboardInventory: (params: {
		Start: string;
		End: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/dashboard-inventory`, {
			params
		});
	}
};
