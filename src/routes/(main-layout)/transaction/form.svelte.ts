import { toast } from 'svelte-sonner';
import { customerService } from '@/services/customerService';
import { itemService } from '@/services/itemService';
import dayjs from 'dayjs';
import { onMount } from 'svelte';

export function useTransactionForm() {
	const state = $state<any>({
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

		// 🔹 Item data
		itemTable: [],
		isLoading: false,

		// 🔹 Tambahan
		amountPaid: 0, // uang dari customer
		totalAll: 0 // total semua produk
	});

	function transformItemData(apiData: any[]) {
		return apiData.map((item: any, index: number) => ({
			id: item.item_id || index + 1,
			barcode_id: item.barcode_id,
			item_id: item.item_id,
			name: item.name,
			label_name: item.label_name,
			harga_jual: Number(item.harga_jual) || 0,
			qty: 1
		}));
	}

	async function handleSearchProduct(value: string) {
		if (!value || !value.trim()) return;

		try {
			state.isLoading = true;
			console.log('🔍 Searching product:', value);

			const res: any = await itemService.getListitemBarcode({
				PageNumber: 1,
				PageSize: 10,
				SearchTerm: value.trim()
			});

			console.log('📦 Raw response:', res?.data?.data);

			let apiData = res?.data?.data;
			if (!Array.isArray(apiData)) apiData = apiData ? [apiData] : [];

			if (apiData.length === 0) {
				toast.error('Produk tidak ditemukan');
				return;
			}

			const firstItem = apiData[0];
			const newItem = transformItemData([firstItem])[0];

			state.itemTable = [...state.itemTable, newItem];

			state.amount = state.itemTable.reduce(
				(total: number, item: any) => total + item.harga_jual * (item.qty || 1),
				0
			);

			console.log('💰 Total Amount:', state.amount);
		} catch (err) {
			console.error('❌ Error fetching product:', err);
			toast.error('Gagal mengambil data produk');
		} finally {
			state.searchProduct = '';
			state.isLoading = false;
		}
	}

	$effect(() => {
		const value = state.searchProduct?.trim();
		if (!value) return;

		const debounceTimer = setTimeout(() => {
			handleSearchProduct(value);
		}, 400);
		return () => clearTimeout(debounceTimer);
	});

	onMount(() => {
		console.log('🟢 useTransactionForm mounted');
	});

	return {
		state,
		handleSearchProduct
	};
}
