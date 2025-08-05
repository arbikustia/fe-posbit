import { sort_hotels } from '$lib/constants/hotel';
import { page } from '$app/state';
import { hotel_result } from '$lib/dummy/hotel-search.json';
import { derived, writable } from 'svelte/store';

export function useSearchHotelPage() {
	const selectedSort = writable('Price Low to High'); 

	const triggerContent = derived(selectedSort, ($s) => {
		return sort_hotels.find((o) => o.value === $s)?.label ?? 'Sort Hotels';
	});

	const sortedHotels = derived(selectedSort, ($s) => {
		return sortHotelResult(hotel_result, $s);
	});

	const searchParam = Object.fromEntries(page.url.searchParams) as any;

	function sortHotelResult(hotels: any[], sortOption: string) {
		const sorted = [...hotels];
		switch (sortOption) {
			case 'Price Low to High':
				sorted.sort((a, b) => a.price - b.price);
				break;
			case 'Price Hight to Low':
				sorted.sort((a, b) => b.price - a.price);
				break;
			case 'Hotel Name A-Z':
				sorted.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'Hotel Name Z-A':
				sorted.sort((a, b) => b.name.localeCompare(a.name));
				break;
			case 'Review Rating Hight to Low':
				sorted.sort((a, b) => b.rating - a.rating);
				break;
		}
		return sorted;
	}

	return {
		hotels: sortedHotels, 
		selectedSort,
		triggerContent,
		sort_hotels,
		searchParam
	};
}
