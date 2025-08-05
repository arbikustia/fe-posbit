import { onMount } from 'svelte';
import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import { hotelService } from '$lib/services/hotelService'; // ganti ke service hotel
import type { SelectState } from './types';
import type { Hotel } from '$lib/types/Hotel';

export function useDrawerWrapper() {
    const state = $state<SelectState<Hotel>>({
        isOpenList: false,
        rawItems: [],
        displayedItems: [],
        filteredItems: [],
        keyword: '',
        limit: 30,
        offset: 0,
        loading: false,
        searchTimeout: null,
        triggerRef: null!
    });

    async function loadHotels() {
        let data: Hotel[] = [];

        const local = localStorageHelper.getItem<Hotel[]>(localStorageKey.autoComplete.hotel);
        if (local) {
            data = local;
        } else {
            data = await hotelService.getAll(); // ambil dari endpoint hotel
            localStorageHelper.setItem(localStorageKey.autoComplete.hotel, data);
        }

        // hanya ambil type: "Hotel"
        state.rawItems = data;
        applySearch();
    }

    function handleSearchDebounce() {
        if (state.searchTimeout) clearTimeout(state.searchTimeout);
        state.searchTimeout = setTimeout(() => {
            applySearch();
        }, 300);
    }

    function applySearch() {
        const q = state.keyword.toLowerCase().trim();

        state.filteredItems = state.rawItems.filter((item) =>
            [item.locationName, item.countryName].some((v) =>
                v.toLowerCase().includes(q)
            )
        );

        state.offset = 0;
        state.displayedItems = [];
        loadMore();
    }

    function loadMore() {
        if (state.loading) return;
        state.loading = true;

        const source = state.filteredItems;
        if (state.offset >= source.length) {
            state.loading = false;
            return;
        }

        state.displayedItems = [
            ...state.displayedItems,
            ...source.slice(state.offset, state.offset + state.limit)
        ];
        state.offset += state.limit;
        state.loading = false;
    }

    function handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
            loadMore();
        }
    }

    async function resetList() {
        await new Promise((r) => setTimeout(r, 300));
        state.keyword = '';
        applySearch();
    }

    onMount(() => {
        loadHotels();
    });

    return {
        state,
        get selectedDisplay() {
            if (!state.keyword) return '';
            const item = state.rawItems.find((f: any) => f.locationName === state.keyword);
            return item ? `${item.locationName}, ${item.countryName}` : '';
        },
        handleScroll,
        resetList,
        handleSearchDebounce
    };
}