import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const summaryShiftService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm?: string, startDate?: string, endDate?: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `view/paged-summary-shift?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.startDate}&End=${params.endDate}`
        );
    },

};
