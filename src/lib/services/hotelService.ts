import dummy from '$lib/dummy/hotel.json';
import type { Hotel } from '$lib/types/Hotel';

export const hotelService = {
    getAll: async (options:any): Promise<Hotel[]> => {
        //await new Promise((resolve) => setTimeout(resolve, 3000));
        return options;
    }
};
