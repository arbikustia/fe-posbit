// usePurchasePage.ts
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { invoiceSchema } from '../_components/form/schema';
import { purchaseService } from '@/services/purchaseService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { itemService } from '@/services/itemService';

export function usePurchasePage() {
    const form = superForm(defaults(zod(invoiceSchema)), {
        SPA: true,
        validators: zod(invoiceSchema),
        dataType: 'json',
        resetForm: false
    });

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
        listItem: any[]; // ✅ tambahkan ini
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
        listItem: [] // ✅ default kosong
    });

    // ✅ FETCH DATA ITEM GUDANG
    async function handleGetListItemGudang() {
        try {
            state.isLoading = true;
            const res: any = await itemService.getListitemGudang();

            if (res?.data?.data) {
                // Map data API ke bentuk yang cocok dipakai di komponen (value, label, stock, price)
                state.listItem = res.data.data.map((item: any, index: number) => ({
                    value: item.kode_barang ?? `item-${index}`,
                    label: item.nama_barang ?? 'Unknown Item',
                    stock: item.jumlah ?? 0,
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

    // 🔹 Transformasi data dari API tanpa field yang berhubungan dengan ID
    // usePurchasePage.ts
    function transformPurchaseData(apiData: any[]) {
        return apiData.map((item, index) => ({
            no: index + 1,
            inv_number: item.inv_number ?? '-',
            customer_name: item.customer?.customer_name ?? '-',
            phone: item.customer?.phone ?? '-',
            status: item.status ?? '-',
            total_amount: item.total_amount ?? 0,
            final_amount: item.final_amount ?? 0,
            discount_amount: item.discount_amount ?? 0,
            payment_method: item.payment_method ?? '-',
            created_at: item.created_at ?? '-',
            purchase_order_details: item.purchase_order_details ?? [],
            open: true // ✅ tampilkan action
        }));
    }



    async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
        try {
            state.isLoading = true;

            const res: any = await purchaseService.getPaged({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm
            });

            if (res?.data?.data) {
                state.table = transformPurchaseData(res.data.data);
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

        const values = get(formData);

        const body = {
            customer_id: values.customer_id,
            point_used: values.point_used,
            point_earned: values.point_earned,
            status: values.status,
            total_amount: values.total_amount,
            final_amount: values.final_amount,
            discount_amount: values.discount_amount,
            payment_method: values.payment_method,
            details: values.details
        };

        try {
            if ((values as any).id) {
                await purchaseService.update({
                    id: String((values as any).id),
                    ...body
                });
                toast.success('Purchase updated successfully');
            } else {
                await purchaseService.create(body);
                toast.success('Purchase created successfully');
            }
            goto('/purchase');
        } catch (err) {
            console.error('Failed to save purchase:', err);
            toast.error('Failed to save purchase');
        }
    }

    onMount(() => {
        handleGetPaged();
        handleGetListItemGudang(); // ✅ panggil di sini
        const url = get(page).url;
        const qp = url.searchParams;
        if (qp.has('id')) return;
    });

    return {
        state,
        form,
        errors,
        handleSubmit,
        handleGetPaged,
        handlePageChange,
        handleGetListItemGudang // ✅ export juga
    };
}
