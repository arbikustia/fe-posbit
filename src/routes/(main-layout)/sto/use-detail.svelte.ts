import { toast } from 'svelte-sonner';
import { userService } from '$lib/services/userService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { stoService } from '@/services/stoService';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { tick } from 'svelte';

export function useStoDetailPage() {
	type stateProps = {
		table: any[];
		showSearch: boolean;
		searchEl: HTMLInputElement | null;
		showDeleteModal: boolean;
		selectedSto: null | any;
		currentPage: number;
		pageSize: number;
		totalPages: number;
		totalCount: number;
		isLoading: boolean;
		isEditing: boolean;
		searchTerm: string;
		isSubmitting: boolean; // 👈 tambah
		belumScanCount: number;
		sudahScanCount: number;
		isScanning: boolean;
		isFailed: boolean;
		barcode: string;
		scanBuffer: string;
	};

	const state = $state<stateProps>({
		table: [],
		showSearch: false,
		searchEl: null,
		showDeleteModal: false,
		selectedSto: null,
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		isLoading: false,
		searchTerm: '',
		isEditing: false,
		isSubmitting: false, // 👈 init,
		belumScanCount: 0,
		sudahScanCount: 0,
		isScanning: false,
		isFailed: false,
		barcode: '',
		scanBuffer: ''
	});

	// 🔹 Transform data dari API ke table
	function transformStoData(apiData: any[]) {
		return apiData.map((item, index) => ({
			id: item.id || index + 1,
			barcode_id: item.barcode_id,
			item_id: item.item_id,
			sto_id: item.sto_id,
			stock_in_id: item.stock_in_id,
			created_by: item.created_by,
			created_at: item.created_at,
			status: item.status,
			open: true
		}));
	}

	function getSudahScanCount(id: string) {
		stoService
			.getPagedById({
				PageNumber: 1,
				PageSize: 999999,
				SearchTerm: 'SUDAH SCAN',
				StoId: id
			})
			.then((res: any) => {
				if (res?.data.status) {
					state.sudahScanCount = res.data.data.length || 0;
					console.log(res.data.data.length, 'data');
				}
			});
	}
	function getBelumScanCount(id: string) {
		stoService
			.getPagedById({
				PageNumber: 1,
				PageSize: 999999,
				SearchTerm: 'BELUM SCAN',
				StoId: id
			})
			.then((res: any) => {
				if (res?.data.status) {
					state.belumScanCount = res.data.data.length || 0;
				}
			});
	}

	// 🔹 Get data berdasarkan pageNumber dan search
	async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
		const url = get(page).url;
		const qp = url.searchParams;
		const id = qp.get('id') || '';
		try {
			state.isLoading = true;

			const res: any = await stoService.getPagedById({
				PageNumber: pageNumber,
				PageSize: state.pageSize,
				SearchTerm: searchTerm,
				StoId: id
			});

			if (res?.data?.data) {
				getSudahScanCount(id);
				getBelumScanCount(id);
				state.table = transformStoData(res.data.data);
				state.currentPage = res.data.page_number ?? pageNumber;
				state.totalPages = res.data.total_pages ?? 1;
				state.totalCount = res.data.total_count ?? state.table.length;
			} else {
				state.table = [];
			}
		} catch (err) {
			console.error('Pagination fetch failed:', err);
			toast.error('Failed to load Sto');
			state.table = [];
		} finally {
			state.isLoading = false;
		}
	}

	// 🔹 Fungsi untuk pindah halaman
	async function handlePageChange(pageNum: number) {
		if (pageNum < 1 || pageNum > state.totalPages) return;
		state.currentPage = pageNum;
		await handleGetPaged(pageNum);
	}

	function getCookie(name: string) {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const cookieValue = parts.pop()?.split(';').shift();
			return cookieValue ? decodeURIComponent(cookieValue) : null;
		}
		return null;
	}

	function generateTimestampCode(): string {
		const now = new Date();

		const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

		return (
			now.getFullYear().toString() +
			pad(now.getMonth() + 1) +
			pad(now.getDate()) +
			pad(now.getHours()) +
			pad(now.getMinutes()) +
			pad(now.getSeconds()) +
			pad(now.getMilliseconds(), 3)
		);
	}

	// 🔹 Submit form (Create / Update)
	async function handleSubmit(e?: Event) {
		e?.preventDefault(); // 👈 cegah reload

		if (state.isSubmitting) return;

		const body = {
			sto_code: `STO-${generateTimestampCode()}`,
			created_by: getCookie('username') || 'superadmin'
		};

		if (!body.sto_code || !body.created_by) return;

		try {
			state.isSubmitting = true;

			const res = await stoService.create(body);

			if (res?.data?.status) {
				toast.success('STO Created Successfully');
				goto('/sto');
			} else {
				toast.error('Failed to Create STO');
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to Create STO');
		} finally {
			state.isSubmitting = false;
		}
	}

	$effect(() => {
		(async () => {
			handleGetPaged(1, state.searchTerm);
		})();
	});

	onMount(() => {
		handleGetPaged(1, '');

		const url = get(page).url;
	});


	const scanBarcode = async (value: string) => {
		if (state.isScanning) return;

		state.isScanning = true;
		const scannedCode = value.trim();
		if (!scannedCode) return;

		try {
			const body = {
				barcode_id: scannedCode,
				created_by: getCookie('username') || 'superadmin'
			};

			const res = await stoService.scanBarcode(body);

			if (res?.data?.status) {
				toast.success(`Scanned: ${scannedCode}`);
				handleGetPaged(1, '');
			} else {
				state.isFailed = true;
				toast.error(`Failed to scan: ${scannedCode}`, {
					closeButton: true,
					duration: Infinity,
					onDismiss: () => (state.isFailed = false)
				});
			}
		} catch (err) {
			console.error(err);
			toast.error('Scan error');
		} finally {
			resetScan();
		}
	};

	function resetScan() {
		state.scanBuffer = '';
		state.barcode = '';
		state.isScanning = false;
	}

	
	return {
		state,
		generateTimestampCode,
		getCookie,
		handleSubmit,
		handleGetPaged,
		handlePageChange,
		scanBarcode,
	};
}
