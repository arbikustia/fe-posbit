import type { DateTime } from '$lib/types/FlightResponse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function formatToTwoDigits(num: number): string {
	return num.toString().padStart(2, '0');
}

export function displayTime(date: Pick<DateTime, 'hour' | 'minute'>): string {
	const hh = formatToTwoDigits(date.hour);
	const mm = formatToTwoDigits(date.minute);

	return `${hh}:${mm}`;
}

export function formatDate(date: DateTime): string {
	const year = formatToTwoDigits(date.year);
	const month = formatToTwoDigits(date.month);
	const day = formatToTwoDigits(date.day);
	const hour = formatToTwoDigits(date.hour);
	const minute = formatToTwoDigits(date.minute);
	return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

export function formatTimeSpan(timeSpanString: string) {
	if (!timeSpanString) {
		return '';
	}
	const regex = /(\d{1,2}):(\d{2}):(\d{2})/; // Match format HH:MM:SS
	const match = timeSpanString.match(regex);

	if (match) {
		const hours = parseInt(match[1], 10);
		const minutes = parseInt(match[2], 10);

		// Return the formatted time string in "Xh Xm" format
		return `${hours}h ${minutes}m`;
	} else {
		return 'Invalid time format';
	}
}

export function isTimeInRange(
	timeSlot: Pick<DateTime, 'hour' | 'minute'>,
	rangeStart: number,
	rangeEnd: number
) {
	const timeSlotDate = new Date(1970, 0, 1, timeSlot.hour, timeSlot.minute);

	const startDate = new Date(1970, 0, 1, rangeStart, 0);
	const endDate = new Date(1970, 0, 1, rangeEnd, 0);

	return timeSlotDate >= startDate && timeSlotDate < endDate;
}

export function displayDate(date: DateTime, format: string = 'ddd, DD MMM YY') {
	const { year, month, day, hour, minute } = date;

	const newDate = new Date(year, month - 1, day, hour, minute);

	return dayjs(newDate).format(format);
}

export function convertDateTimeToRelativeText(date: DateTime) {
	const targetDate = dayjs()
		.year(date.year)
		.month(date.month - 1)
		.date(date.day)
		.hour(date.hour)
		.minute(date.minute)
		.second(0)
		.millisecond(0);

	return targetDate.fromNow();
}

export function displayUtcOffset(utcOffset: number = 0) {
	return `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
}
