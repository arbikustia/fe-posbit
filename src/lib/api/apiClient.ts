import axiosInstance from './axiosConfig';

export const apiClient = {
	get: (url: string, params = {}) => axiosInstance.get(url, { params }),
	post: (url: string, data: unknown) => axiosInstance.post(url, data),
	put: (url: string, data: unknown) => axiosInstance.put(url, data),
	delete: (url: string) => axiosInstance.delete(url)
};
