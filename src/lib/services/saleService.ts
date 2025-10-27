import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const saleService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/sale/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/sale/${id}`
        );
    },
    create: (body: {
        item_id: string,
        qty: number,
        sale_id: string,
    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/sale`, body
        );
    },
    update: (body: {
        id: string;
        item_id: string,
        qty: number,
        sale_id: string,
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/sale/${body.id}`, body
        );
    },
};
