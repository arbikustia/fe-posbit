import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const customerService = {
    getByNumber: (number: number) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/customer/${number}`
        );
    },
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/customer/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/customer/${id}`
        );
    },
    create: (body: {
        customer_name: string,
        phone: string,
        is_member: boolean,
        point: number,
        type:string
    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/customer`, body
        );
    },
    update: (body: {
        id: string,
        customer_name: string,
        phone: string,
        is_member: boolean,
        point: number,
        type: string
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/customer/${body.id}`, body
        );
    },
};
