import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const dashboardService = {
    getSummary: (params: { Start: string, End: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/dashboard/summary?Start=${params.Start}&End=${params.End}`
        );
    },
    getChart: (params: { Start: string, End: string, Filter:string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/dashboard/grafik?Start=${params.Start}&End=${params.End}&Filter=${params.Filter}`
        );
    },
   
};
