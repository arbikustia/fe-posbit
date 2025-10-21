import { userStore } from '$lib/stores/userStore';
import type { RestApiResponse } from '$lib/types/api/base/RestApi';
import axios from 'axios';
import { toast } from 'svelte-sonner';
// import { PUBLIC_SHOW_API_REQUEST_ERROR, PUBLIC_BASE_API_URL } from '$env/static/public';

const showApiRequestError = true;

const apiClient = axios.create({
	baseURL: 'https://pos.bantuit.my.id/api/',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request Interceptor
apiClient.interceptors.request.use(
	(config) => {
		// Tambahkan token jika ada
		const token = userStore.getToken();
		if (token) {
			if (config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
	(response) => responseHandler(response),
	(error) => {
		return errorHandler(error);
	}
);

// defining a custom response handler for all APIs
const responseHandler = (response: any) => {
	if (showApiRequestError) {
		if (
			response &&
			typeof response.data === 'object' &&
			(response.data as RestApiResponse<unknown>).isFailure
		) {
			const resData = response.data as RestApiResponse<unknown>;
			toast.error(`Code: ${resData.errors[0].code ?? '-'}`, {
				closeButton: true,
				duration: Number.POSITIVE_INFINITY,
				description: `Message: ${resData.errors[0].message}`,
				position: 'bottom-right'
			});

			return Promise.reject({
				response: {
					data: resData.errors
				}
			});
		}
	}

	return response;
};

// defining a custom error handler for all APIs
const errorHandler = async (error: any) => {
	const statusCode = error.response?.status;
	const originalRequest = error.config;

	// logging only errors that are not 401
	if (statusCode && statusCode !== 401) {
		if (showApiRequestError) {
			const errData = error.response?.data;
			if (errData && errData?.status) {
				toast.error(errData?.title, {
					closeButton: true,
					duration: Number.POSITIVE_INFINITY,
					description: `Detail: ${errData?.detail}\nTrace ID: ${errData?.traceId}`,
					position: 'bottom-right'
				});
			}
		}
	}

	if (statusCode && statusCode === 401 && !originalRequest._retry) {
		originalRequest._retry = true;

		handleRefreshToken(originalRequest);
	}

	return Promise.reject(error);
};

async function handleRefreshToken(originalRequest: any) {
	try {
		// Call refresh endpoint
		const refreshRes = await fetch('/api/auth/refresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const refresh = await refreshRes.json();

		if (refresh?.success) {
			// set auth token with fresh token
			userStore.setToken(refresh.token);
			// Retry original request with new token
			return apiClient(originalRequest);
		} else {
			throw new Error('Token refresh failed');
		}
	} catch (refreshError) {
		console.error('Token refresh failed:', refreshError);
		window.location.reload();
	}
}

export const setBaseURL = (url: string) => {
	apiClient.defaults.baseURL = url;
};

export default apiClient;
