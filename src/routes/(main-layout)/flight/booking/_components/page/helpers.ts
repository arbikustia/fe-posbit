import type { z } from 'zod';
import type { passengerSchema } from './schema';
import { capitalizeEachWord } from '$lib/helpers/string-helper';

export function getPassengerFullName(passenger: z.infer<typeof passengerSchema>) {
	if (passenger.title && passenger.firstName && passenger.lastName) {
		return `${capitalizeEachWord(passenger.title)}. ${passenger.firstName} ${passenger.lastName}`;
	}

	return passenger.alias;
}
