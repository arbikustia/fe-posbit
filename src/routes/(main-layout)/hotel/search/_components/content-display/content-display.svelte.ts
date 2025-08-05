import { writable } from 'svelte/store';

export const selectedStars = writable<number[]>([]);



export function filterHotelsByStar(hotels: any[], selectedStars: number[]): any[] {
    if (!selectedStars || selectedStars.length === 0) return hotels;
    return hotels.filter(hotel => selectedStars.includes(hotel.rating));
}