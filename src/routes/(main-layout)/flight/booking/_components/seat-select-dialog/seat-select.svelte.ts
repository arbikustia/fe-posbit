import type { SeatColumn, SeatMapSegment, SeatRow } from '$lib/types/api/flight/ancillary/SeatMap';
import type { z } from 'zod';
import type { seatSchema } from '../page/schema';

type UniqueSeatTypeMap = Map<
	string,
	{ price: number; currency: string; seatName: string; color: string }
>;

function getRandomHexColor() {
	// Generate a random integer between 0 and 0xFFFFFF (16777215)
	const randomColor = Math.floor(Math.random() * 16777216).toString(16);
	// Pad with leading zeros if necessary to ensure 6 digits
	return '#' + randomColor.padStart(6, '0');
}

export function useSeatSelect() {
	// TODO: need to change the color generation for consistent results
	function getUniqueSeatTypeMap(seatMapSegment: SeatMapSegment): UniqueSeatTypeMap {
		const uniqueTypes = new Map();

		if (seatMapSegment && Array.isArray(seatMapSegment.Rows)) {
			seatMapSegment.Rows.forEach((row: SeatRow) => {
				if (row && Array.isArray(row.columns)) {
					row.columns.forEach((seat) => {
						// Process only if it's a seat and has a valid price and name
						if (seat && seat.IsSeat === true && seat.PriceAdult !== null && seat.SeatName) {
							const price = seat.PriceAdult;
							const name = seat.SeatName;
							const currency = seat.Currency || 'N/A'; // Use 'N/A' if currency is missing

							// Create a unique key based on price and name
							const key = `${price}-${name}`;

							// Add to map if it's a new unique type
							if (!uniqueTypes.has(key)) {
								uniqueTypes.set(key, {
									price: price,
									currency: currency,
									seatName: name,
									color: getRandomHexColor()
								});
							}
						}
					});
				}
			});
		}

		return uniqueTypes;
	}

	function getSeatTypes(uniqueSeatTypeMap: UniqueSeatTypeMap) {
		return Array.from(uniqueSeatTypeMap.values()).sort((a, b) => a.price - b.price);
	}

	function getSeatColor(col: SeatColumn, uniqueSeatTypeMap: UniqueSeatTypeMap) {
		if (!col.IsSeat) return 'transparent';
		if (!col.IsAvailable) return '#d1d5db';
		const key = `${col.PriceAdult}-${col.SeatName}`;
		return uniqueSeatTypeMap.get(key)?.color;
	}

	function handleSeatClick(
		col: SeatColumn,
		selectedSeats: z.infer<typeof seatSchema>[],
		onSeatSelect: (seat: SeatColumn) => void
	) {
		if (col.IsAvailable && col.IsSeat) {
			const isSeatTaken = !!selectedSeats.find((item) => item.seatId === col.SeatCode);
			if (!isSeatTaken) {
				onSeatSelect(col);
			}
		}
	}

	function getRegularRow(seatMapSegment: SeatMapSegment) {
		return seatMapSegment.Rows.find((row) => row.Number !== 'EX' && row.columns.length > 0)!;
	}

	function getColumnHeaders(regularRow: SeatRow) {
		return regularRow.columns.map((col) => (col.IsSeat ? col.SeatColumn : ''));
	}

	// Normalisasi kolom agar align dengan pattern regularRow
	function normalizeColumns(columns: SeatColumn[], regularRow: SeatRow) {
		const normalized: (SeatColumn | null)[] = new Array(regularRow.columns.length).fill(null);
		regularRow.columns.forEach((patternCol, idx) => {
			const match = columns.find((col) => {
				if (col.IsSeat && patternCol.IsSeat) {
					return col.SeatColumn === patternCol.SeatColumn;
				} else if (!col.IsSeat && !patternCol.IsSeat) {
					return true;
				}
				return false;
			});
			normalized[idx] = match || null;
		});
		return normalized;
	}

	return {
		getUniqueSeatTypeMap,
		getSeatTypes,
		getSeatColor,
		handleSeatClick,
		getRegularRow,
		getColumnHeaders,
		normalizeColumns
	};
}
