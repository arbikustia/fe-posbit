import type { SuperForm } from 'sveltekit-superforms';
import type { z } from 'zod';
import type { bookingSchema, seatSchema } from '../page/schema';
import type { SeatColumn, SeatMapSegment } from '$lib/types/api/flight/ancillary/SeatMap';

export type SeatSelectDialogProps = {
	open: boolean;
	form: SuperForm<z.infer<typeof bookingSchema>>;
	isMultiCity?: boolean;
};

export type SeatSelectDialogState = {
	seatMapSegments: SeatMapSegment[];
	selectedPassengerIdx: number;
	selectedSegment: SeatMapSegment;
};

export type SeatSelectProps = {
	seatMapSegemnt: SeatMapSegment;
	onSeatSelect: (seat: SeatColumn) => void;
	selectedSeats: z.infer<typeof seatSchema>[];
};
