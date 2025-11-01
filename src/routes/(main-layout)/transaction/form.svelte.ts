import { toast } from 'svelte-sonner';
import { customerService } from '@/services/customerService';
import { itemService } from '@/services/itemService';
import dayjs from 'dayjs';
import { onMount, onDestroy } from 'svelte';

export function useTransactionForm() {
	const state = $state<any>({
		customerName: '',
		customerNumber: null,
		searchProduct: '',
		amount: null,
		discount: null,
		currentTime: dayjs().format('DD-MM-YYYY HH:mm:ss'),
		paymentMethod: 'CASH',
		paymentMethodeOpen: false,
		customerData: null,
		username: '',
		itemTable: [],
		isLoading: false,
		amountPaid: null,
		totalAll: 0,
		isFetchingCustomer: false,
		listItem: [],
		isPurchasing: false,

		// 🔹 Untuk auto-scan
		scanBuffer: '',
		scanInputRef: null as HTMLInputElement | null
	});

	let scanTimer: NodeJS.Timeout | null = null;

	// 🔹 Transformasi data item dari API
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

	// 🔹 Fetch produk berdasarkan barcode
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

	// 🔹 Handler keyboard global untuk auto-scan
	function handleGlobalKeydown(e: KeyboardEvent) {
		// Abaikan jika sedang mengetik di input lain (kecuali scan input)
		const target = e.target as HTMLElement;
		const isInputOrTextarea = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
		const isScanInput = target.getAttribute('data-scan-input') === 'true';

		// Jika mengetik di input lain (bukan scan input), abaikan
		if (isInputOrTextarea && !isScanInput) return;

		// Jika tekan Enter, proses scan langsung (bypass $effect)
		if (e.key === 'Enter') {
			if (state.scanBuffer.trim()) {
				e.preventDefault();
				handleSearchProduct(state.scanBuffer.trim());
				state.scanBuffer = '';
				state.searchProduct = ''; // Clear tanpa trigger $effect
				if (state.scanInputRef) {
					state.scanInputRef.value = '';
				}
			}
			return;
		}

		// Jika karakter yang bisa diketik (alfanumerik, dll)
		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			state.scanBuffer += e.key;

			// Update input visual tanpa trigger $effect
			if (state.scanInputRef) {
				state.scanInputRef.value = state.scanBuffer;
			}

			// Auto-clear buffer setelah 100ms (untuk barcode scanner yang cepat)
			if (scanTimer) clearTimeout(scanTimer);
			scanTimer = setTimeout(() => {
				if (state.scanBuffer.trim()) {
					handleSearchProduct(state.scanBuffer.trim());
					state.scanBuffer = '';
					state.searchProduct = ''; // Clear tanpa trigger $effect
					if (state.scanInputRef) {
						state.scanInputRef.value = '';
					}
				}
			}, 100);
		}

		// Jika Backspace, hapus karakter terakhir
		if (e.key === 'Backspace') {
			e.preventDefault();
			state.scanBuffer = state.scanBuffer.slice(0, -1);
			if (state.scanInputRef) {
				state.scanInputRef.value = state.scanBuffer;
			}
		}
	}

	// ✅ FETCH DATA ITEM GUDANG
	async function handleGetListItemGudang() {
		try {
			state.isLoading = true;
			const res: any = await itemService.getListitemBarcode({
				PageNumber: 1,
				PageSize: 10,
				SearchTerm: ""
			});

			if (res?.data?.data) {
				// Map data API ke bentuk yang cocok dipakai di komponen (value, label, stock, price)
				state.listItem = res.data.data.map((item: any, index: number) => ({
					value: item.barcode_id ?? `item-${index}`,
					label: item.name ?? 'Unknown Item',
					stock: item.label_name ?? 0,
					price: item.harga_beli ?? 0
				}));
			} else {
				state.listItem = [];
			}
		} catch (err) {
			console.error('Failed to fetch gudang items:', err);
			toast.error('Failed to load items from gudang');
			state.listItem = [];
		} finally {
			state.isLoading = false;
		}
	}


	// 🔹 Effect: Fetch customer data jika nomor diinput
	$effect(() => {
		(async () => {
			if (state.customerNumber && state.customerNumber > 0) {
				state.isFetchingCustomer = true;
				try {
					console.log('👤 Fetching customer with number:', state.customerNumber);
					const res = await customerService.getByNumber(state.customerNumber);

					if (res?.data?.status && res?.data?.data) {
						state.customerData = res.data.data;
						state.customerName = res.data.data.customer_name ?? '';
						console.log('✅ Customer found:', state.customerData);
					} else {
						// 🔹 Reset jika customer tidak ditemukan
						state.customerData = null;
						state.customerName = '';
						toast.error('Customer not found');
					}
				} catch (err) {
					console.error('❌ Error fetching customer:', err);
					// 🔹 Reset jika error
					state.customerData = null;
					state.customerName = '';
					toast.error('Customer not found');
				} finally {
					state.isFetchingCustomer = false;
				}
			} else {
				// 🔹 Reset jika input kosong
				state.customerData = null;
				state.customerName = '';
			}
		})();
	});


	$effect(() => {
		(async () => {
			handleSearchProduct(state.searchProduct);
		})()
	})

	onMount(() => {
		handleGetListItemGudang();
		console.log('🟢 useTransactionForm mounted');

		// Tambahkan global keyboard listener
		document.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			document.removeEventListener('keydown', handleGlobalKeydown);
			if (scanTimer) clearTimeout(scanTimer);
		};
	});

	return {
		state,
		handleSearchProduct
	};
}