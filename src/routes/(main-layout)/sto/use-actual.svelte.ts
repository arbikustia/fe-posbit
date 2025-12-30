import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { stoService } from '@/services/stoService';

export function useStoActualPage() {
    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedSto: null | any;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        isLoading: boolean;
        isEditing: boolean;
        searchTerm: string;
        isSubmitting: boolean; // 👈 tambah
        belumScanCount: number;
        sudahScanCount: number;
        isScanning: boolean;
    };

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedSto: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0,
        isLoading: false,
        searchTerm: '',
        isEditing: false,
        isSubmitting: false, // 👈 init,
        belumScanCount: 0,
        sudahScanCount: 0,
        isScanning: false
    });

    // 🔹 Transform data dari API ke table
    function transformStoData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            barcode_id: item.barcode_id,
            item_id: item.item_id,
            sto_id: item.sto_id,
            created_by: item.created_by,
            created_at: item.created_at,
            open: true
        }));
    }

   
    // 🔹 Get data berdasarkan pageNumber dan search
    async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
        const url = get(page).url;
        const qp = url.searchParams;
        const id = qp.get('id') || '';
        try {
            state.isLoading = true;

            const res: any = await stoService.getPagedActualById({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm,
                StoId: id
            });

            if (res?.data?.data) {
                state.table = transformStoData(res.data.data);
                state.currentPage = res.data.page_number ?? pageNumber;
                state.totalPages = res.data.total_pages ?? 1;
                state.totalCount = res.data.total_count ?? state.table.length;
            } else {
                state.table = [];
            }
        } catch (err) {
            console.error('Pagination fetch failed:', err);
            toast.error('Failed to load Sto');
            state.table = [];
        } finally {
            state.isLoading = false;
        }
    }

    // 🔹 Fungsi untuk pindah halaman
    async function handlePageChange(pageNum: number) {
        if (pageNum < 1 || pageNum > state.totalPages) return;
        state.currentPage = pageNum;
        await handleGetPaged(pageNum);
    }

  

    $effect(() => {
        (async () => {
            handleGetPaged(1, state.searchTerm);
        })();
    });

    onMount(() => {
        handleGetPaged(1, '');

        const url = get(page).url;
        const qp = url.searchParams;
    });

    return {
        state,
        handleGetPaged,
        handlePageChange,
    };
}
