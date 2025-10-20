import apiClient from '$lib/api/apiClient';
import axiosInstance from '$lib/api/axiosConfig';

import { userStore } from '$lib/stores/userStore';
import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const userService = {
	getToken: () => {
		//TODO : refresh token
		return userStore.getToken();
	},
	login: async (username: string, password: string) => {
		const response = await axiosInstance.post('/login', { username, password });
		return response.data;
	},

	getUserProfile: async () => {
		const response = await axiosInstance.get('/user/me');
		return response.data;
	},

	getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
		return apiClient.get<RestApiResponse<unknown>>(
			`/users/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
		);
	}
};
