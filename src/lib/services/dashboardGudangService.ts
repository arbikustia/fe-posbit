import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const dashboardGudangService = {
	getPagedDetail: (params: { TransactionNumber: string; ItemId?: string | undefined }) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/get-by-transaction-number`, {
			params
		});
	},
	getPagedDetailBarcode: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Status: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-barcode`, {
			params
		});
	},
	getPagedIn: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-in`, {
			params
		});
	},
	getPagedOut: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-out`, {
			params
		});
	},
	getPagedOutCustomer: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-out-cust`, {
			params
		});
	},
	getPagedNg: (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/paged-ng`, {
			params
		});
	},
	getDashboardInventory: (params: { Start: string; End: string }) => {
		return apiClient.get<RestApiResponse<unknown>>(`/sp/dashboard-inventory`, {
			params
		});
	},
	getExcelPageIn: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`sp/export-paged-in?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}&Location=${params.Location}&To=${params.To}`,
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
			let filename = `Page-In-${new Date().getTime()}.xlsx`;

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
	getExcelPageBarcode: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Status: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`sp/export-paged-barcode?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}&Status=${params.Status}`,
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
			let filename = `Data-Barcode-${new Date().getTime()}.xlsx`;

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
	getExcelPageOut: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
		Location: string;
		To: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`sp/export-paged-out?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}&Location=${params.Location}&To=${params.To}`,
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
			let filename = `Page-In-${new Date().getTime()}.xlsx`;

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
	getExcelOutCust: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`sp/export-out-cust?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}`,
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
			let filename = `Out-Customer-${new Date().getTime()}.xlsx`;

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
	getExcelNg: async (params: {
		PageNumber: number;
		PageSize: number;
		SearchTerm: string;
		Start: string;
		End: string;
	}): Promise<void> => {
		try {
			const response: any = await apiClient.get(
				`sp/export-ng?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}`,
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
			let filename = `Ng-${new Date().getTime()}.xlsx`;

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
