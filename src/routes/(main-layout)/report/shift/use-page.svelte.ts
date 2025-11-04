import { toast } from 'svelte-sonner';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { summaryShiftService } from '@/services/shiftService';
import dayjs from 'dayjs';

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
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
        isLoading: false,
        searchTerm: ''
    });

    // 🔹 Transform data dari API ke bentuk table dengan struktur baru
    function transformItemData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            tgl_kerja: item.tgl_kerja ?? '-',
            shift: item.shift ?? '-',
            modal: item.modal ?? 0,
            cash: item.cash ?? 0,
            transfer: item.transfer ?? 0,
            total_earning: item.total_earning ?? 0,
            actual_earning: item.actual_earning ?? 0,
            gap: item.gap ?? 0,
            kasir: item.kasir ?? '-',
            open: true
        }));
    }

    let debounceTimer: NodeJS.Timeout;

    // 🔹 Efek: pencarian otomatis
    $effect(() => {
        (async () => {
            await handleGetPaged(1, state.searchTerm);
        })();
    });

    // 🔹 ✅ EFEK BARU: Refresh data ketika tanggal berubah
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

    // 🔹 Pagination handler - UPDATE untuk include date filter
    async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
        try {
            state.isLoading = true;

            const res: any = await summaryShiftService.getPaged({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm,
                startDate: state.startDate, // ✅ Kirim startDate ke API
                endDate: state.endDate      // ✅ Kirim endDate ke API
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
            toast.error('Failed to load shift data');
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

    onMount(() => {
        handleGetPaged();
    });

    return {
        state,
        handleGetPaged,
        handlePageChange,
        handleSearch,
        handleDateFilter, // ✅ Export fungsi baru
        handleClearSearch // ✅ Export fungsi clear search
    };
}