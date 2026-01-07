import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const dashboardGudangService = {
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
	}
};
