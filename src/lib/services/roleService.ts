import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const roleService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/role/list-role?page_number=${params.PageNumber}&page_size=${params.PageSize}&search_term=${params.SearchTerm}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/role/${id}`
        );
    },
    create: (body: {
        role: string;
    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/role`, body
        );
    },
    update: (body: {
        id: string;
        role: string;
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/role/${body.id}`, body
        );
    },
};
