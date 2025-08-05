import { formatThousand } from '$lib/helpers/number-helper';
import type { FlightClass } from '$lib/types/FlightResponse';
import type { FlightCardClassProps } from './types';

export function useFlightCardClass() {
	function getTriggerContent({ value, classList }: FlightCardClassProps) {
		if (classList) {
			var selectedCls = classList.find((f) => f.uniqueId === value);
			if (selectedCls) {
				return `${formatThousand(selectedCls.fare.total)} - ${selectedCls.bookingClass}`;
			}
		}
		return 'Select class';
	}

	function getLabel(cls: FlightClass) {
		return `${formatThousand(cls.fare.total)} - ${cls.bookingClass} (${cls.seatCount})`;
	}
	return { getTriggerContent, getLabel };
}
