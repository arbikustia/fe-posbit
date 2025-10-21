import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const pointService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/point/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/point/${id}`
        );
    },
    create: (body: {
        amount_per_point: number;
        point_value: number;
        is_active: boolean;
    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/point`, body
        );
    },
    update: (body: {
        id: string;
        amount_per_point: number;
        point_value: number;
        is_active: boolean;
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/point/${body.id}`, body
        );
    },
};
