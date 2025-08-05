import axiosInstance from '$lib/api/axiosConfig';

import { userStore } from '$lib/stores/userStore';

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
	}
};
