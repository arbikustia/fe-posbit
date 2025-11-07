import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const purchaseService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string, EndDate?: string, StartDate?: string, Status: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/purchase-order/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Status=${params.Status}`
        );
    },
    getReportExcel: async (params: {
        PageNumber: number,
        PageSize: number,
        SearchTerm: string,
        EndDate: string,
        StartDate: string,
        Status: string
    }): Promise<void> => {
        try {
            const response = await apiClient.get(
                `/purchase-order/export-report-po?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Status=${params.Status}`,
                {
                    responseType: 'blob' // Important for file download
                }
            );

            // Create blob from response
            const blob = new Blob([response.data], {
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
    getPagedReport: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/purchase-order/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    getDataPackage: () => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/view/get-data-package`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/purchase-order/${id}`
        );
    },
    create: (body: {
        customer_id: string,
        point_used: number,
        point_earned: number,
        status: string,
        total_amount: number,
        final_amount: number,
        discount_amount: number,
        payment_method: string,
        details: {
            item_id: string,
            qty: number
        }[]

    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/purchase-order`, body
        );
    },
    purchaseLog: (body: {
        inv_number: string,
        action: string,
        aktivitas: string

    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/purchase-order/log-po`, body
        );
    },
    update: (body: {
        id: string;
        customer_id: string,
        point_used: number,
        point_earned: number,
        status: string,
        total_amount: number,
        final_amount: number,
        discount_amount: number,
        payment_method: string,
        details: {
            item_id: string,
            qty: number
        }[]
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/purchase-order/${body.id}`, body
        );
    },
};
