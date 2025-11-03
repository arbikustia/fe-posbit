import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const modalService = {
    getStatusModalAwal: () => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/view/get-status-modal`
        );
    },

    create: (body: {
        cashier_id: string,
        modal_awal: number,
        is_modal_awal: boolean,
    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/sale/modal-awal`, body
        );
    },
    update: (body: {
        id: string;
        cashier_id: string,
        actual_earning: number,
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/sale/modal-awal/${body.id}`, body
        );
    },
};
