import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const purchaseService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/purchase-order/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    getPagedReport: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/purchase-order/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/PurchaseOrder/${id}`
        );
    },
    create: (body: {
        customer_id: string,
        point_used: number,
        point_earned: number,
        status: string,
        total_amount: number,
        final_amount: number,
        discount_amount: number,
        payment_method: string,
        details: {
            item_id: string,
            qty: number
        }[]

    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/PurchaseOrder`, body
        );
    },
    update: (body: {
        id: string;
        customer_id: string,
        point_used: number,
        point_earned: number,
        status: string,
        total_amount: number,
        final_amount: number,
        discount_amount: number,
        payment_method: string,
        details: {
            item_id: string,
            qty: number
        }[]
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/PurchaseOrder/${body.id}`, body
        );
    },
};
