import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const itemService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/item/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    getListitemToko: () => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/view/stok-toko`
        );
    },
    getListitemGudang: () => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/view/stok-gudang`
        );
    },
    getListitemBarcode: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/view/paged-stok-barcode-toko?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
   
};
