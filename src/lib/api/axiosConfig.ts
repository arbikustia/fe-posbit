import axios from 'axios';

const axiosInstance = axios.create({
	//baseURL: process.env.BASEAPIURL || 'https://api.example.com',
	baseURL: 'https://pos.daalushijab.site/api/',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request Interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// Tambahkan token jika ada
		// const token = localStorage.getItem('token');
		// if (token) {
		// 	if (config.headers) {
		// 		config.headers.Authorization = `Bearer ${token}`;
		// 	}
		// }
		return config;
	},
	(error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		return errorHandler(error);
	}
);

// defining a custom error handler for all APIs
const errorHandler = (error: any) => {
	const statusCode = error.response?.status;

	// logging only errors that are not 401
	if (statusCode && statusCode !== 401) {
		console.error(error);
	}

	return Promise.reject(error);
};

export const setBaseURL = (url: string) => {
	axiosInstance.defaults.baseURL = url;
};

export default axiosInstance;
