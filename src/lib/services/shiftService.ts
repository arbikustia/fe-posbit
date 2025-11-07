import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const summaryShiftService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm?: string, startDate?: string, endDate?: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `view/paged-summary-shift?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.startDate}&End=${params.endDate}`
        );
    },

    getReportExcel: async (params: {
        PageNumber: number,
        PageSize: number,
        SearchTerm: string,
        EndDate: string,
        StartDate: string,
    }): Promise<void> => {
        try {
            const response:any = await apiClient.get(
                `view/export-summary-shift?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StartDate=${params.StartDate}&EndDate=${params.EndDate}`,
                {
                    responseType: 'blob' // Important for file download
                }
            );

            // Create blob from response
            const blob:any = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from response headers or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `purchase-report-${new Date().getTime()}.xlsx`;

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

};
