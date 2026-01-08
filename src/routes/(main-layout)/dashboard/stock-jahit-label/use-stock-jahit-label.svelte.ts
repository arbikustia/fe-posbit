import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import dayjs from 'dayjs';
import { dashboardGudangService } from '@/services/dashboardGudangService';

export function useSummaryShiftPage() {
    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedItem: null | any;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        isLoading: boolean;
        searchTerm: string;
        startDate: string;
        endDate: string;
    };

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedItem: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0,
        startDate: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        isLoading: false,
        searchTerm: ''
    });

    // 🔹 Transform data dari API ke bentuk table dengan struktur baru
    function transformItemData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            stock_out_id: item.stock_out_id,
            transaction_number: item.transaction_number,
            transaction_date: item.transaction_date,
            location: item.location,
            from: item.from,
            to: item.to,
            item_id: item.item_id,
            qty: item.qty,
            remarks: item.remarks,
            scan_by: item.scan_by
        }));
    }

    let debounceTimer:any;

    // 🔹 Efek: pencarian otomatis
    $effect(() => {
        (async () => {
            await handleGetPaged(1, state.searchTerm);
        })();
    });

    $effect(() => {
        // Hanya jalankan jika startDate dan endDate sudah terisi
        if (state.startDate && state.endDate) {
            console.log('Date range changed, refreshing data...', state.startDate, state.endDate);

            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            debounceTimer = setTimeout(() => {
                handleGetPaged(1, state.searchTerm);
            }, 300);
        }
    });

    async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
        try {
            state.isLoading = true;

            const res: any = await dashboardGudangService.getPagedIn({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm,
                Start: state.startDate,
                End: state.endDate,
                Location: 'JAHITLABEL',
                To: 'JAHITLABEL'
            });

            if (res?.data?.data) {
                state.table = transformItemData(res.data.data);
                state.currentPage = res.data.page_number ?? pageNumber;
                state.totalPages = res.data.total_pages ?? 1;
                state.totalCount = res.data.total_count ?? state.table.length;
            } else {
                state.table = [];
                state.totalPages = 0;
                state.totalCount = 0;
            }
        } catch (err) {
            console.error('Pagination fetch failed:', err);
            toast.error('Failed to load Stock data');
            state.table = [];
            state.totalPages = 0;
            state.totalCount = 0;
        } finally {
            state.isLoading = false;
        }
    }

    // 🔹 Ganti halaman
    async function handlePageChange(pageNum: number) {
        if (pageNum < 1 || pageNum > state.totalPages) return;
        state.currentPage = pageNum;
        await handleGetPaged(pageNum);
    }

    // 🔹 Handle search input
    function handleSearch(term: string) {
        state.searchTerm = term;
        // Reset ke halaman 1 saat search
        state.currentPage = 1;
        // Data akan otomatis ter-refresh oleh $effect di atas
    }

    // 🔹 ✅ FUNGSI BARU: Handle date filter change
    async function handleDateFilter(startDate: string, endDate: string) {
        state.startDate = startDate;
        state.endDate = endDate;
        state.currentPage = 1; // Reset ke halaman 1 saat filter tanggal berubah

        // Data akan otomatis ter-refresh oleh $effect di atas
        console.log('Date filter applied:', startDate, endDate);
    }

    // 🔹 ✅ FUNGSI BARU: Clear search
    function handleClearSearch() {
        state.searchTerm = '';
        state.currentPage = 1;
        state.showSearch = false;
    }

    return {
        state,
        handleGetPaged,
        handlePageChange,
        handleSearch,
        handleDateFilter, 
        handleClearSearch 
    };
}
