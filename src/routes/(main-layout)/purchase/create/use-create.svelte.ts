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
        startDate: string,
        endDate: string,
        filter: {},
        popoverOpen: false,
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
            inv_number: string,
            action: string,
            aktivitas: string
        }[]
        poLogDecreaseItem: {
            inv_number: string,
            action: string,
            aktivitas: string
        }[]
        poLogIncreaseQty: {
            inv_number: string,
            action: string,
            aktivitas: string
        }[]
        poLogDecreaseQty: {
            inv_number: string,
            action: string,
            aktivitas: string
        }[]
        detailFromParams: any[]
    };

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedPurchase: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0,
        isLoading: false,
        searchTerm: '',
        paymentStatus: '',
        statusPo: '',
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
        filter: {},
        popoverOpen: false,
        isEditing: false,
        listItem: [],
        poLogIncreaseItem: [],
        poLogDecreaseItem: [],
        poLogIncreaseQty: [],
        poLogDecreaseQty: [],
        detailFromParams: []
    });

    // Fetch items from gudang
    async function handleGetListItemGudang() {
        try {
            state.isLoading = true;
            const res: any = await itemService.getListitemGudang();

            state.listItem = res?.data?.data?.map((item: any, index: number) => ({
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
            toast.error('Failed to load items from gudang');
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
            discount_amount: item.discount_amount ?? 0,
            down_payment: item.down_payment ?? 0,
            payment_method: item.payment_method ?? '-',
            package_id: item.package_id ?? '-',
            package_name: item.package_name ?? '-',
            created_at: item.created_at ?? '-',
            created_by: item.created_by ?? '-',
            keterangan: item.keterangan ?? '',
            label: item.label ?? 0, // <-- tambahkan ini
            ongkir: item.ongkir ?? 0, // <-- tambahkan ini
            purchase_order_details: item.purchase_order_details ?? [],
            open: true
        }));
    }

    async function handleGetPaged(
        pageNumber = state.currentPage,
        searchTerm = state.searchTerm,
        startDate = state.startDate,
        endDate = state.endDate
    ) {
        try {
            state.isLoading = true;
            const res: any = await purchaseService.getPaged({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm,
                PaymentStatus: state.paymentStatus,
                StatusPo: state.statusPo,
                StartDate: startDate,
                EndDate: endDate
            });

            if (res?.data?.data) {
                let transformed = transformPurchaseData(res.data.data);

                // 🔹 Apply statusFilter
                if (state.paymentStatus) {
                    transformed = transformed.filter(
                        (p) => p.payment_status === state.paymentStatus
                    );
                }
                if (state.statusPo) {
                    transformed = transformed.filter(
                        (p) => p.status_po === state.statusPo
                    );
                }

                state.table = transformed;
                state.currentPage = res.data.page_number ?? pageNumber;
                state.totalPages = res.data.total_pages ?? 1;
                state.totalCount = res.data.total_count ?? state.table.length;
            } else {
                state.table = [];
            }
        } catch (err) {
            console.error('Pagination fetch failed:', err);
            toast.error('Failed to load purchases');
            state.table = [];
        } finally {
            state.isLoading = false;
        }
    }

    async function handlePageChange(pageNum: number) {
        if (pageNum < 1 || pageNum > state.totalPages) return;
        state.currentPage = pageNum;
        await handleGetPaged(pageNum);
    }

    async function handleSubmit() {
        const result = await validateForm({ update: true });
        if (!result.valid) {
            toast.error('Please check your input');
            return;
        }

        const values: any = get(formData);

        const detailUpdate = values.details.map((item: any, index: number) => ({
            item_id: item.item_id,
            qty: item.qty,
            qty_keluar: state?.detailFromParams?.[index]?.qty_keluar || 0
        }));

        // Payload sesuai API - tambahkan label dan ongkir
        const body = {
            person_id: values.customer_id ?? 0,
            payment_status: values.payment_status ?? 'DP',
            status_po: values.status_po ?? 'OPEN',
            down_payment: values.down_payment ?? 0,
            total_amount: values.total_amount ?? 0,
            final_amount: values.final_amount ?? 0,
            discount_amount: values.discount_amount ?? 0,
            payment_method: values.payment_method ?? 'CASH',
            package_id: values.package_id ?? 'Harga Normal',
            create_by: getCookie('username') || 'system',
            keterangan: values.keterangan ?? '',
            labels: values.labels ?? [],
            ongkir: values.ongkir ?? 0,
            details: values.details ?? [] // Default tetap pakai values.details
        };

        try {
            if ((values as any).id) {
                // Untuk update, gunakan detailUpdate
                const updateBody = {
                    ...body,
                    details: detailUpdate // Ganti dengan detailUpdate untuk update
                };

                await purchaseService.update({ id: String((values as any).id), ...updateBody });

                const processLogsCombined = async (
                    increaseLogs: { inv_number: string; action: string; aktivitas: string }[],
                    decreaseLogs: { inv_number: string; action: string; aktivitas: string }[]
                ) => {
                    const allLogs = [...decreaseLogs, ...increaseLogs];
                    if (allLogs.length === 0) return;

                    console.log('All logs to process:', allLogs);

                    const lastLogsByActionCode = allLogs.reduce((acc, current) => {
                        acc[current.action] = current;
                        return acc;
                    }, {} as { [key: string]: any });

                    console.log('Unique action codes:', Object.keys(lastLogsByActionCode));

                    for (const actionCode in lastLogsByActionCode) {
                        await purchaseService.purchaseLog(lastLogsByActionCode[actionCode]);
                        const log = lastLogsByActionCode[actionCode];
                        console.log(`Posted last log for action: ${actionCode}, type: ${log.aktivitas.includes('Increase') ? 'increase' : 'decrease'}`);
                    }
                };

                const processItemLogs = async (
                    increaseLogs: { inv_number: string; action: string; aktivitas: string }[],
                    decreaseLogs: { inv_number: string; action: string; aktivitas: string }[],
                    logType: 'increase' | 'decrease'
                ) => {
                    const logs = logType === 'increase' ? increaseLogs : decreaseLogs;
                    if (logs.length === 0) return;

                    console.log(`Processing ${logType} item logs:`, logs);

                    const lastLogsByActionCode = logs.reduce((acc, current) => {
                        acc[current.action] = current;
                        return acc;
                    }, {} as { [key: string]: any });

                    console.log(`Unique ${logType} item action codes:`, Object.keys(lastLogsByActionCode));

                    for (const actionCode in lastLogsByActionCode) {
                        await purchaseService.purchaseLog(lastLogsByActionCode[actionCode]);
                        console.log(`Posted ${logType} item log for action: ${actionCode}`);
                    }
                };

                // Process logs
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
                // Untuk create, tetap pakai values.details
                await purchaseService.create(body)
                    .then((res) => {
                        if (res.data.messages[0] == "Tidak dapat membuat PO baru karena terdapat PO dengan status OPEN untuk customer ini.") {
                            toast.warning('Tidak dapat membuat PO baru karena terdapat PO dengan status OPEN untuk customer ini.');
                        } else {
                            toast.success('Purchase created successfully');
                        }
                    })
            }
            goto('/purchase');
        } catch (err) {
            console.error('Failed to save purchase:', err);
            toast.error('Failed to save purchase');
        }
    }

    // 🔹 Tambahkan $effect supaya refresh otomatis jika statusFilter berubah
    $effect(() => {
        handleGetPaged(1, state.searchTerm);
    });


    onMount(() => {
        handleGetPaged();
        handleGetListItemGudang();

        // ✅ Load data untuk edit dari URL query params
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
                    console.warn('Failed to parse labels:', labels);
                } catch (e) {
                    console.error('Failed to parse labels:', e);
                }
            }

            // Parse details dari query param jika ada
            let details: any[] = [];
            const detailsParam = qp.get('details');
            if (detailsParam) {
                try {
                    state.detailFromParams = JSON.parse(decodeURIComponent(detailsParam))
                    console.log(state.detailFromParams, 'detailFromParams')
                    details = JSON.parse(decodeURIComponent(detailsParam));
                } catch (e) {
                    console.error('Failed to parse details:', e);
                }
            }
            console.warn(labels,
                'labels params'
            )

            formData.update((f) => ({
                ...f,
                id: qp.get('id') ?? (f as any).id,
                inv_number: qp.get('inv_number') ?? (f as any).inv_number,
                customer_id: String(qp.get('customer_id') ?? f.customer_id),
                payment_status: qp.get('payment_status')!,
                status_po: qp.get('status_po')!,
                payment_method: qp.get('payment_method') ?? f.payment_method,
                package_id: qp.get('package_id') ?? f.package_id,
                total_amount: parseFloat(qp.get('total') ?? '0'),
                final_amount: parseFloat(qp.get('final') ?? '0'),
                discount_amount: parseFloat(qp.get('discount') ?? '0'),
                down_payment: parseFloat(qp.get('down_payment') ?? '0'),
                labels: labels.length > 0 ? labels : f.labels,
                ongkir: parseFloat(qp.get('ongkir') ?? '0'), // <-- tambahkan ini
                keterangan: qp.get('keterangan') ?? '',
                details: details.length > 0 ? details : f.details
            }));
        }
    });

    return {
        state,
        form,
        errors,
        handleSubmit,
        handleGetPaged,
        handlePageChange,
        handleGetListItemGudang
    };
}