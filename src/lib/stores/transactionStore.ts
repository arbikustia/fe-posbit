import { writable } from 'svelte/store';
import dayjs from 'dayjs';

export const transactionState = writable({
	customerName: '',
	customerNumber: 0,
	searchProduct: '',
	amount: 0,
	discount: 0,
	currentTime: dayjs().format('DD-MM-YYYY HH:mm:ss'),
	paymentMethod: 'CASH',
	paymentMethodeOpen: false,
	customerData: null,
	username: '',
	itemTable: [],
	isLoading: false
});
