// usePurchasePage.ts
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { invoiceSchema } from '../_components/form/schema';
import { purchaseService } from '@/services/purchaseService';
import { itemService } from '@/services/itemService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { browser } from '$app/environment';
import dayjs from 'dayjs';

function getInitialFilters() {
	if (!browser) return {};
	const url = new URL(window.location.href);
	if (url.pathname !== '/purchase') return {};
	return {
		page: Number(url.searchParams.get('page')) || 1,
		size: Number(url.searchParams.get('size')) || 10,
		search: url.searchParams.get('search') || '',
		payment: url.searchParams.get('payment') || '',
		status: url.searchParams.get('status') || '',
		start: url.searchParams.get('start') || dayjs().startOf('month').format('YYYY-MM-DD'),
		end: url.searchParams.get('end') || dayjs().endOf('month').format('YYYY-MM-DD')
	};
}

export function usePurchasePage() {
	const form = superForm(defaults(zod(invoiceSchema)), {
		SPA: true,
		validators: zod(invoiceSchema),
		dataType: 'json',
		resetForm: false
	});

	function getCookie(name: string) {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
		return null;
	}

	const { form: formData, validateForm, errors } = form;

	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedPurchase: null | any;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		searchTerm: string;
		paymentStatus: string;
		statusPo: string;
		startDate: string;
		endDate: string;
		filter: {};
		popoverOpen: false;
		isEditing: boolean;
		listItem: {
			value: string;
			label: string;
			stock: number;
			deskripsi: string;
			kode_barang: string;
			harga: number;
			harga_a: number;
			harga_b: number;
			harga_c: number;
			harga_d: number;
			harga_e: number;
			harga_f: number;
		}[];
		poLogIncreaseItem: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogDecreaseItem: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogIncreaseQty: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		poLogDecreaseQty: {
			inv_number: string;
			action: string;
			aktivitas: string;
		}[];
		detailFromParams: any[];
		allData: any[];
		originalData: any[]; // Data asli dari API sebelum difilter
		isStatusOpen: boolean;
	};

	const initialFilters = getInitialFilters();

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedPurchase: null,
		currentPage: initialFilters.page || 1,
		pageSize: initialFilters.size || 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: initialFilters.search || '',
		paymentStatus: initialFilters.payment || '',
		statusPo: initialFilters.status || '',
		startDate: initialFilters.start || dayjs().startOf('month').format('YYYY-MM-DD'),
		endDate: initialFilters.end || dayjs().endOf('month').format('YYYY-MM-DD'),
		filter: {},
		popoverOpen: false,
		isEditing: false,
		listItem: [],
		poLogIncreaseItem: [],
		poLogDecreaseItem: [],
		poLogIncreaseQty: [],
		poLogDecreaseQty: [],
		detailFromParams: [],
		allData: [],
		originalData: [], // Data asli dari API
		isStatusOpen: false
	});

	// Fetch items from gudang
	async function handleGetListItemGudang() {
		try {
			state.isLoading = true;
			const res: any = await itemService.getListitemGudang();

			state.listItem =
				res?.data?.data?.map((item: any, index: number) => ({
					value: item.kode_barang ?? `item-${index}`,
					label: item.nama_barang ?? 'Unknown Item',
					stock: item.jumlah ?? 0,
					deskripsi: item.deskripsi ?? '',
					kode_barang: item.kode_barang ?? '',
					harga: item.harga ?? 0,
					harga_a: item.harga_a ?? item.harga,
					harga_b: item.harga_b ?? item.harga,
					harga_c: item.harga_c ?? item.harga,
					harga_d: item.harga_d ?? item.harga,
					harga_e: item.harga_e ?? item.harga,
					harga_f: item.harga_f ?? item.harga
				})) || [];
		} catch (err) {
			console.error('Failed to fetch gudang items:', err);
			// toast.error('Failed to load items from gudang');
			state.listItem = [];
		} finally {
			state.isLoading = false;
		}
	}

	// Transform API data for table
	function transformPurchaseData(apiData: any[]) {
		return apiData.map((item, index) => ({
			no: index + 1,
			id: item.id ?? '-',
			inv_number: item.inv_number ?? '-',
			person_id: item.person_id ?? '-',
			customer_name: `${item.person?.firstname ?? '-'} ${item.person?.lastname ?? ''}`.trim(),
			customer_code: item.person?.supliercustomerid ?? '-',
			telephone: item.person?.telephone ?? '-',
			mobile: item.person?.mobile ?? '-',
			person_type: item.person?.type ?? 'Customer',
			payment_status: item.payment_status ?? '-',
			status_po: item.status_po ?? '-',
			total_amount: item.total_amount ?? 0,
			final_amount: item.final_amount ?? 0,
			biaya_label: item.biaya_label ?? 0,
			discount_amount: item.discount_amount ?? 0,
			down_payment: item.down_payment ?? 0,
			payment_method: item.payment_method ?? '-',
			package_id: item.package_id ?? '-',
			package_name: item.package_name ?? '-',
			created_at: item.created_at ?? '-',
			created_by: item.created_by ?? '-',
			keterangan: item.keterangan ?? '',
			label: item.label ?? 0,
			ongkir: item.ongkir ?? 0,
			purchase_order_details: item.purchase_order_details ?? [],
			log_po: item.log_po ?? [],
			open: true
		}));
	}

	// Fungsi untuk memfilter data di frontend
	function filterData(data: any[], searchTerm: string) {
		if (!searchTerm.trim()) return data;

		const term = searchTerm.toLowerCase();
		return data.filter(
			(item) =>
				item.inv_number?.toLowerCase().includes(term) ||
				item.customer_name?.toLowerCase().includes(term) ||
				item.customer_code?.toLowerCase().includes(term) ||
				item.telephone?.toLowerCase().includes(term) ||
				item.mobile?.toLowerCase().includes(term) ||
				item.payment_status?.toLowerCase().includes(term) ||
				item.status_po?.toLowerCase().includes(term) ||
				item.payment_method?.toLowerCase().includes(term) ||
				item.keterangan?.toLowerCase().includes(term)
		);
	}

	// Fungsi untuk apply pagination ke data yang sudah difilter
	function applyPagination(data: any[], pageNumber: number, pageSize: number) {
		const startIndex = (pageNumber - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return data.slice(startIndex, endIndex);
	}

	// Fungsi untuk update table berdasarkan data yang ada
	function updateTable() {
		let filteredData = state.originalData;

		// Apply status filter
		if (state.paymentStatus) {
			filteredData = filteredData.filter((p) => p.payment_status === state.paymentStatus);
		}
		if (state.statusPo) {
			filteredData = filteredData.filter((p) => p.status_po === state.statusPo);
		}

		// Apply search filter
		filteredData = filterData(filteredData, state.searchTerm);

		// Simpan ke allData
		state.allData = filteredData;

		// Update pagination info
		// state.totalCount = filteredData.length;
		// state.totalPages = Math.ceil(filteredData.length / state.pageSize);

		// Ensure current page is valid
		if (state.currentPage > state.totalPages && state.totalPages > 0) {
			state.currentPage = state.totalPages;
		} else if (state.totalPages === 0) {
			state.currentPage = 1;
		}

		// Apply pagination
		state.table = applyPagination(filteredData, state.currentPage, state.pageSize);
	}

	async function handleGetPaged(
		pageNumber = state.currentPage,
		searchTerm = state.searchTerm,
		startDate = state.startDate,
		endDate = state.endDate
	) {
		if (browser) {
			const url = new URL(window.location.href);
			if (url.pathname === '/purchase') {
				url.searchParams.set('page', String(pageNumber));
				url.searchParams.set('size', String(state.pageSize));
				if (state.searchTerm) url.searchParams.set('search', state.searchTerm);
				else url.searchParams.delete('search');
				if (state.paymentStatus) url.searchParams.set('payment', state.paymentStatus);
				else url.searchParams.delete('payment');
				if (state.statusPo) url.searchParams.set('status', state.statusPo);
				else url.searchParams.delete('status');
				if (startDate) url.searchParams.set('start', startDate);
				if (endDate) url.searchParams.set('end', endDate);
				goto(url.toString(), { replaceState: true, keepFocus: true });
			}
		}

		try {
			state.isLoading = true;
			const res: any = await purchaseService.getPaged({
				PageNumber: pageNumber, // Ambil semua data
				PageSize: state.pageSize, // Ambil data dalam jumlah besar
				SearchTerm: state.searchTerm, // Tidak pakai search di backend
				PaymentStatus: state.paymentStatus,
				StatusPo: state.statusPo,
				StartDate: startDate,
				EndDate: endDate
			});

			if (res?.data?.data) {
				state.totalPages = res.data.total_pages;
				state.totalCount = res.data.total_count;
				const transformed = transformPurchaseData(res.data.data);

				// Simpan data asli
				state.table = transformed;

				// Update table dengan data yang baru
				// updateTable();
			} else {
				state.originalData = [];
				state.allData = [];
				state.table = [];
				state.totalCount = 0;
				state.totalPages = 0;
				state.currentPage = 1;
			}
		} catch (err) {
			state.originalData = [];
			state.allData = [];
			state.table = [];
			state.totalCount = 0;
			state.totalPages = 0;
			state.currentPage = 1;
		} finally {
			state.isLoading = false;
		}
	}

	// Fungsi untuk handle search di frontend
	function handleSearch(searchTerm: string) {
		state.searchTerm = searchTerm;
		state.currentPage = 1; // Reset ke page 1 saat search

		// Update table dengan filter search baru
		// updateTable();
	}

	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;

		state.currentPage = pageNum;
		handleGetPaged(pageNum, state.searchTerm);

		// Update table dengan page baru
		// updateTable();
	}

	$effect(() => {
		(async () => {
			if (state.searchTerm) {
				console.log(state.searchTerm);
				handleGetPaged(state.currentPage, state.searchTerm);
			}
		})();
	});

	onMount(() => {
		handleGetPaged();
		handleGetListItemGudang();

		if (browser) {
			const url = get(page).url;
			const isEdit = url.searchParams.get('edit') === 'true';

			if (isEdit) {
				loadPurchaseDataFromStorage();
			} else {
				// Load dari URL params (jika ada)
				loadPurchaseDataFromParams();
			}
		}
	});

	function loadPurchaseDataFromParams() {
		try {
			const url = get(page).url;
			const qp = url.searchParams;
			const hasAny = qp.has('id') || qp.has('customer_id') || qp.has('payment_status');

			if (hasAny) {
				state.isEditing = true;

				let labels: any[] = [];
				const labelsParam = qp.get('labels');
				if (labelsParam) {
					try {
						labels = JSON.parse(decodeURIComponent(labelsParam));
						labels = labels.map((label) => ({
							...label,
							qty: label.qty || 1,
							price: label.price || 0
						}));
					} catch (e) {
						console.error('Failed to parse labels:', e);
					}
				}

				let details: any[] = [];
				const detailsParam = qp.get('details');
				if (detailsParam) {
					try {
						state.detailFromParams = JSON.parse(decodeURIComponent(detailsParam));
						details = JSON.parse(decodeURIComponent(detailsParam));
					} catch (e) {
						console.error('Failed to parse details:', e);
					}
				}

				formData.update((f) => ({
					...f,
					id: qp.get('id') ?? (f as any).id,
					inv_number: qp.get('inv_number') ?? (f as any).inv_number,
					customer_id: String(qp.get('customer_id') ?? f.customer_id),
					payment_status: qp.get('payment_status')!,
					status_po: qp.get('status_po')!,
					payment_method: qp.get('payment_method') ?? f.payment_method,
					package_id: qp.get('package_id') ?? f.package_id,
					total_amount: parseFloat(qp.get('total_amount') ?? '0'),
					final_amount: parseFloat(qp.get('final') ?? '0'),
					biaya_label: parseFloat(qp.get('discount') ?? '0'),
					discount_amount: parseFloat(qp.get('discount_amount') ?? '0'),
					down_payment: parseFloat(qp.get('down_payment') ?? '0'),
					labels: labels.length > 0 ? labels : f.labels,
					ongkir: parseFloat(qp.get('ongkir') ?? '0'),
					keterangan: qp.get('keterangan') ?? '',
					details: details.length > 0 ? details : f.details
				}));
			}
		} catch (err) {
			console.error('Failed to load purchase data from params:', err);
		}
	}
	let isMarketplace = false;
	function loadPurchaseDataFromStorage() {
		try {
			if (!browser) return;

			const storedData = sessionStorage.getItem('editing_purchase');
			if (!storedData) {
				console.warn('No purchase data found in session storage');
				// toast.error('No purchase data found for editing');
				// goto('/purchase');
				return;
			}

			const purchaseData = JSON.parse(storedData);
			console.warn('Loaded from session storage:', purchaseData); // Debug log

			state.isEditing = true;

			// Pastikan details memiliki struktur yang benar
			const formattedDetails =
				purchaseData.details?.map((detail: any) => ({
					item_id: detail.item_id,
					qty: detail.qty || 1,
					qty_keluar: detail.qty_keluar || 0,
					qty_delivery: detail.qty_delivery || 0,
					discount: detail.discount || 0,
					price: detail.price || 0,
					priceKey: detail.priceKey || 'Harga Normal',
					name: detail.name || ''
				})) || [];

			// Pastikan labels memiliki struktur yang benar
			const formattedLabels =
				purchaseData.labels?.map((label: any) => ({
					label_id: label.label_id || label.id,
					qty: label.qty || 1,
					price: label.price || 0
				})) || [];
			if (purchaseData.package_name.toLowerCase() === 'shopee') {
				isMarketplace = true;
			}

			// Update form data
			formData.update((f) => ({
				...f,
				id: purchaseData.id,
				inv_number: purchaseData.inv_number,
				customer_id: String(purchaseData.customer_id || ''),
				payment_status: purchaseData.payment_status,
				status_po: purchaseData.status_po,
				payment_method: purchaseData.payment_method,
				package_id: purchaseData.package_id,
				total_amount: purchaseData.total_amount,
				final_amount: purchaseData.final_amount,
				biaya_label: purchaseData.biaya_label || 0,
				discount_amount: purchaseData.discount_amount || 0,
				down_payment: purchaseData.down_payment || 0,
				labels: formattedLabels,
				ongkir: purchaseData.ongkir || 0,
				keterangan: purchaseData.keterangan || '',
				details: formattedDetails
			}));

			// Simpan detail asli untuk perbandingan
			state.detailFromParams = [...formattedDetails];

			// Hapus data dari session storage setelah digunakan
			// sessionStorage.removeItem('editing_purchase');
		} catch (err) {
			console.error('Failed to load purchase data from storage:', err);
			toast.error('Failed to load purchase data');
			goto('/purchase');
		}
	}

	onMount(() => {
		console.warn(state?.detailFromParams, 'state?.detailFromParams test1');
	});

	async function handleSubmit() {
		const result = await validateForm({ update: true });
		if (!result.valid) {
			toast.error('Please check your input');
			return;
		}

		const values: any = get(formData);

		// Match qty_keluar by item_id to avoid index/order mismatch when editing
		const detailUpdate = values.details.map((item: any) => {
			const matching = state.detailFromParams.find((d: any) => d.item_id === item.item_id) || {};
			return {
				item_id: item.item_id,
				qty: item.qty,
				qty_keluar: matching.qty_keluar || 0,
				qty_delivery: matching.qty_delivery || 0,
				price: item.price,
				discount: item.discount ?? 0
			};
		});
		console.warn(validateForm, 'lklkl');
		const body = {
			person_id: values.customer_id ?? 0,
			payment_status: values.payment_status ?? 'DP',
			status_po: values.status_po ?? 'OPEN',
			down_payment: values.down_payment ?? 0,
			total_amount: values.total_amount > 0 ? values.total_amount : 0,
			final_amount: values.final_amount ?? 0,
			biaya_label: values.biaya_label ?? 0,
			discount_amount: values.discount_amount ?? 0,
			payment_method: values.payment_method ?? 'CASH',
			package_id: values.package_id ?? 'Harga Normal',
			create_by: getCookie('username') || 'system',
			keterangan: values.keterangan ?? '',
			labels: values.labels ?? [],
			ongkir: values.ongkir ?? 0,
			details: (values.details ?? []).map((d: any) => ({
				item_id: d.item_id,
				qty: d.qty,
				price: d.price ?? 0,
				discount: d.discount ?? 0
			}))
		};

		try {
			if ((values as any).id) {
				console.log(isMarketplace, 'isMarketplace');
				const updateBody = {
					...body,
					total_amount: isMarketplace ? body.total_amount : 0,
					details: detailUpdate
				};

				await purchaseService.update({ id: String((values as any).id), ...updateBody });

				// ... (kode processLogs tetap sama)
				const processLogsCombined = async (
					increaseLogs: { inv_number: string; action: string; aktivitas: string }[],
					decreaseLogs: { inv_number: string; action: string; aktivitas: string }[]
				) => {
					const allLogs = [...decreaseLogs, ...increaseLogs];
					if (allLogs.length === 0) return;

					const lastLogsByActionCode = allLogs.reduce(
						(acc, current) => {
							acc[current.action] = current;
							return acc;
						},
						{} as { [key: string]: any }
					);

					for (const actionCode in lastLogsByActionCode) {
						await purchaseService.purchaseLog(lastLogsByActionCode[actionCode]);
					}
				};

				const processItemLogs = async (
					increaseLogs: { inv_number: string; action: string; aktivitas: string }[],
					decreaseLogs: { inv_number: string; action: string; aktivitas: string }[],
					logType: 'increase' | 'decrease'
				) => {
					const logs = logType === 'increase' ? increaseLogs : decreaseLogs;
					if (logs.length === 0) return;

					const lastLogsByActionCode = logs.reduce(
						(acc, current) => {
							acc[current.action] = current;
							return acc;
						},
						{} as { [key: string]: any }
					);

					for (const actionCode in lastLogsByActionCode) {
						await purchaseService.purchaseLog(lastLogsByActionCode[actionCode]);
					}
				};

				if (state.poLogIncreaseQty.length > 0 || state.poLogDecreaseQty.length > 0) {
					await processLogsCombined(state.poLogIncreaseQty, state.poLogDecreaseQty);
				}

				if (state.poLogIncreaseItem.length > 0) {
					await processItemLogs(state.poLogIncreaseItem, [], 'increase');
				}

				if (state.poLogDecreaseItem.length > 0) {
					await processItemLogs([], state.poLogDecreaseItem, 'decrease');
				}

				toast.success('Purchase updated successfully');
			} else {
				await purchaseService.create(body).then((res) => {
					if (
						res.data.messages[0] ==
						'Tidak dapat membuat PO baru karena terdapat PO dengan status OPEN untuk customer ini.'
					) {
						toast.warning(
							'Tidak dapat membuat PO baru karena terdapat PO dengan status OPEN untuk customer ini.'
						);
					} else {
						toast.success('Purchase created successfully');
					}
				});
			}
			goto('/purchase');
		} catch (err) {
			console.error('Failed to save purchase:', err);
			toast.error('Failed to save purchase');
		}
	}

	return {
		state,
		form,
		errors,
		handleSubmit,
		handleGetPaged,
		handlePageChange,
		handleGetListItemGudang,
		handleSearch
	};
}
