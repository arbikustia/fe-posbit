// $lib/types/HotelResponse.ts
export interface Hotel {
	id: string;
	name: string;
	star: number;
	address: string;
	price: number;
	currency?: string;
	image?: string;
	amenities?: string[];
	description?: string;
}

export interface HotelResult {
	hotels: Hotel[];
	totalCount: number;
	location: string;
	checkInDate: string;
	checkOutDate: string;
}

// $lib/types/SearchHotelParam.ts
export interface SearchHotelParam {
	location: string;
	checkInDate: string;
	checkOutDate: string;
	guests: number;
	rooms: number;
}