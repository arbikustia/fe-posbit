import { goto } from "$app/navigation";
import { convertUrlParamToSearchHotelParam, redirectToSearchHotel, saveLastSearchHotel } from "$lib/helpers/search-hotel-helper";
import { CalendarDate } from "@internationalized/date";
import dayjs from "dayjs";
import { onMount } from "svelte";
import { effect } from "zod";

export const defaultHotel = {
    type: "City",
    locationName: "Jakarta",
    countryName: ""
}
export function useSearchForm() {
    const start = dayjs();
    const end = dayjs().add(2, 'day');
    const tempDate: any = $state({ start: undefined, end: undefined });


    const state = $state<any>({
        searchModel: {
            companyCode: "",
            destination: defaultHotel.locationName,
            popoverOpen: false,
            room: 1,
            guest: 1,
            date: {
               start:dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'day').format('YYYY-MM-DD')
            },
            tempRange: {
                start: start.toISOString(),
                end: end.toISOString()
            },
            startValue: undefined,
            nationalityIcon:'emojione-v1:flag-for-indonesia',
            nationalityName: 'Indonesia'
        },
        validation: {},
        isSubmitted: false
    });




    const increaseGuest = (key: 'guest' | 'room') => {
        state.searchModel = {
            ...state.searchModel,
            [key]: state.searchModel[key] + 1
        };
    };

    const decreaseGuest = (key: 'guest' | 'room') => {
        if (key === 'guest' && state.searchModel.guest > 1) {
            state.searchModel = {
                ...state.searchModel,
                guest: state.searchModel.guest - 1
            };
        }
        if (key === 'room' && state.searchModel.room > 1) {
            state.searchModel = {
                ...state.searchModel,
                room: state.searchModel.room - 1
            };
        }
    };

    function getNights(range: { start: string; end: string }): number {
        if (range?.start && range?.end) {
            return dayjs(range.end).diff(dayjs(range.start), 'day');
        }
        return 0;
    }

    function submitSearch(onSubmitCallback: any['onSubmitCallback']) {
        // const { companyCode, destination, date, room, guest } = state.searchModel;
        state.isSubmitted = true;
        redirectToSearchHotel(state.searchModel);
        saveLastSearchHotel(state.searchModel);

        // use timeout for waiting search param update
        setTimeout(() => {
            onSubmitCallback?.();
        });

        state.isSubmitted = false;
    }

    onMount(() => {
        const searchHotelParam = convertUrlParamToSearchHotelParam();
        state.searchModel = {
            ...state.searchModel,
            ...searchHotelParam,
        };
    });

    return { state, tempDate, getNights, submitSearch, increaseGuest, decreaseGuest };
}
