import type { AncillaryResponse } from '$lib/types/api/flight/ancillary/AncillaryResponse';
import type { SeatMapSegment } from '$lib/types/api/flight/ancillary/SeatMap';
import ancillaryDummy from '$lib/dummy/ancillary/ancillary.json';
import seatMapDummy from '$lib/dummy/ancillary/seat-map.json';

export const ancillaryService = {
	getAll: async (): Promise<AncillaryResponse> => {
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		return ancillaryDummy as unknown as AncillaryResponse;
	},
	getSeatMap: async (): Promise<SeatMapSegment[]> => {
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		return seatMapDummy as unknown as SeatMapSegment[];
	}
};
