import apiClient from '$lib/api/apiClient';
import type { RestApiResponse } from '$lib/types/api/base/RestApi';


export const hotelService = {
    getAll: () => {
        return apiClient.get<RestApiResponse<any[]>>('/api/role/get-all-role');
    }
};