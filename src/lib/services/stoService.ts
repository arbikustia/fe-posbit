import apiClient from '$lib/api/apiClient';
import axiosInstance from '$lib/api/axiosConfig';

import { userStore } from '$lib/stores/userStore';
import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const stoService = {
	getPaged: (params: { PageNumber: number; PageSize: number; SearchTerm?: string }) => {
		return apiClient.get<RestApiResponse<unknown>>(
			`/sto/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
		);
	},
	getPagedById: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm?: string;
		StoId: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(
			`/sto/paged-detail?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StoId=${params.StoId}`
		);
	},
	getPagedActualById: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm?: string;
		StoId: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(
			`/sto/paged-actual?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StoId=${params.StoId}`
		);
	},

	delete: (id: string) => {
		return apiClient.delete<RestApiResponse<unknown>>(`/sto/${id}`);
	},
	create: (body: { sto_code: string; created_by: string }) => {
		return apiClient.post<RestApiResponse<unknown>>(`/sto`, body);
	},
	scanBarcode: (body: { barcode_id: string; created_by: string }) => {
		return apiClient.post<RestApiResponse<unknown>>(`/sto/scan-barcode`, body);
	},
	update: (body: { id: string; is_active: boolean; update_by: string }, id: string) => {
		return apiClient.put<RestApiResponse<unknown>>(`/sto/${id}`, body);
	},

	getActualExcel: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		id: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`/sto/export-actual?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StoId=${params.id}`,
				{
					responseType: 'blob' // Important for file download
				}
			);

			// Create blob from response
			const blob: any = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Extract filename from response headers or use default
			const contentDisposition = response.headers['content-disposition'];
			let filename = `sto-actual-${new Date().getTime()}.xlsx`;

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1];
					// Ensure .xlsx extension
					if (!filename.endsWith('.xlsx')) {
						filename += '.xlsx';
					}
				}
			}

			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading Excel:', error);
			throw new Error('Failed to download Excel file');
		}
	},
	getDetailExcel: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		id: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`/sto/export-detail?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StoId=${params.id}`,
				{
					responseType: 'blob' // Important for file download
				}
			);

			// Create blob from response
			const blob: any = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Extract filename from response headers or use default
			const contentDisposition = response.headers['content-disposition'];
			let filename = `sto-detail-${new Date().getTime()}.xlsx`;

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1];
					// Ensure .xlsx extension
					if (!filename.endsWith('.xlsx')) {
						filename += '.xlsx';
					}
				}
			}

			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading Excel:', error);
			throw new Error('Failed to download Excel file');
		}
	}
};
