import dummy from '$lib/dummy/airport-complete.json';
import type { Airport } from '$lib/types/Airport';

export const airportService = {
	getAll: async (): Promise<Airport[]> => {
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		return dummy.data;
	}
};
