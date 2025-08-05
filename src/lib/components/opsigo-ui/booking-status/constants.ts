import type { BookingStatus } from './booking-status.svelte';

export const bookingStatusColor: Record<BookingStatus, string> = {
	reserved: '#0087CB',
	ticketed: '#00D345',
	expired: '#a1a1a1',
	canceled: '#c46500',
	error: '#C40000'
};
