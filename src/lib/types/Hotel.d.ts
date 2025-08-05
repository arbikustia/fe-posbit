export interface Hotel {
    type: string,
    locationName: string,
    countryName: string
}


export interface SearchHotelParam {
    companyCode: string;
    date: { start: string, end: string }
    room: number;
    guest: number;
    destination: string;
}