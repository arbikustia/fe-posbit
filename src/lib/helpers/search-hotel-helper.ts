import { goto } from "$app/navigation";
import localStorageHelper from './local-storage-helper';
import { localStorageKey } from '$lib/constants/local-storage';
import { page } from '$app/state';
import type { Route } from '$lib/types/SearchFlightParam';
import dayjs from "dayjs";


interface HotelQueryParam {
    com?: string;
    dt?: string;
    rm?: string;
    px?: string;
    des?: string;
    nati?: string;
    natn?: string;
}

interface SearchHotelParam {
    companyCode: string;
    date: { start: string, end: string }
    room: number;
    guest: number;
    destination: string;
    nationalityIcon?: string;
    nationalityName?: string;
}

export function redirectToSearchHotel(searchModel: any) {
    const queryParam: any = {
        com: searchModel.companyCode,
        dt: `${searchModel.date.start}.${searchModel.date.end}`,
        rm: searchModel.room,
        px: `${searchModel.guest}`,
        des: searchModel.destination,
        nati: searchModel.nationalityIcon,
        natn: searchModel.nationalityName
    };
    const params = new URLSearchParams(queryParam);

    const paramStr = params.toString();
    goto(`/hotel/search?${paramStr}`);
}

export function saveLastSearchHotel(searchModel: any) {
    const lastSearches =
        localStorageHelper.getItem<any[]>(localStorageKey.hotel.lastSearch) ?? [];

    const searchData: any = {
        ...searchModel,
    };

    const filteredLastSearches = lastSearches.filter(
        (obj) => JSON.stringify(obj) !== JSON.stringify(searchData)
    );

    filteredLastSearches.push(searchData);

    localStorageHelper.setItem(localStorageKey.hotel.lastSearch, filteredLastSearches);
}

export function convertUrlParamToSearchHotelParam(): SearchHotelParam {
    const searchParam = Object.fromEntries(page.url.searchParams) as HotelQueryParam;

    const result: SearchHotelParam = {
        companyCode: '',
        date: {
            start: dayjs().format('YYYY-MM-DD'),
            end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        },
        room: 1,
        guest: 1,
        destination: '',
        nationalityIcon: 'emojione-v1:flag-for-indonesia',
        nationalityName: 'Indonesia'
    };

    if (searchParam.com !== undefined) {
        result.companyCode = searchParam.com;
    }

    if (searchParam.dt) {
        const [checkIn, checkOut] = searchParam.dt.split('.');
        result.date.start = checkIn;
        result.date.end = checkOut || checkIn; // fallback: same day
    }

    if (searchParam.rm !== undefined) {
        result.room = Number(searchParam.rm);
    }

    if (searchParam.px !== undefined) {
        result.guest = Number(searchParam.px);
    }

    if (searchParam.des) {
        result.destination = searchParam.des;
    }
    if (searchParam.nati) {
        result.nationalityIcon = searchParam.nati;
    }
    if (searchParam.natn) {
        result.nationalityName = searchParam.natn;
    }

    return result;
}
