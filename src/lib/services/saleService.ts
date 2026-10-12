import apiClient from '$lib/api/apiClient';

import type { RestApiResponse } from '$lib/types/api/base/RestApi';

export const saleService = {
    getPaged: (params: { PageNumber: number, PageSize: number, SearchTerm: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/sale/paged?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}`
        );
    },
    getPagedReport: (params: { PageNumber: number, PageSize: number, SearchTerm: string, Start: string, End: string }) => {
        return apiClient.get<RestApiResponse<unknown>>(
            `/sale/paged-report-sale?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.Start}&End=${params.End}`
        );
    },
    delete: (id: string) => {
        return apiClient.delete<RestApiResponse<unknown>>(
            `/sale/${id}`
        );
    },
    create: (body: {
        customer_id: string,
        customer_name: string,
        phone: string,
        is_member: boolean,
        cashier_id: string,
        total_amount: number,
        discount_amount: number,
        final_amount: number,
        point_used: number,
        point_earned: number,
        payment_method: string,
        amount_receive: number,
        chance: number,
        details:
        {
            barcode_id: string,
            item_id: string,
            qty: number,
            price: number,
            discount: number
        }[]

    }) => {
        return apiClient.post<RestApiResponse<unknown>>(
            `/sale`, body
        );
    },
    update: (body: {
        id: string;
        item_id: string,
        qty: number,
        sale_id: string,
    }) => {
        return apiClient.put<RestApiResponse<unknown>>(
            `/sale/${body.id}`, body
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
                `/sale/export-report-sales?PageNumber=${params.PageNumber}&PageSize=${params.PageSize}&SearchTerm=${params.SearchTerm}&Start=${params.StartDate}&End=${params.EndDate}&IsExport=true`,
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
            let filename = `sale-report-${new Date().getTime()}.xlsx`;

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
