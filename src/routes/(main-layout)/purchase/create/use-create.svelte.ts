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
        listItem: { value: string; label: string; stock: number; price: number }[];
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
        listItem: []
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
                price: item.harga_beli ?? 0
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
            status: item.status ?? '-',
            total_amount: item.total_amount ?? 0,
            final_amount: item.final_amount ?? 0,
            discount_amount: item.discount_amount ?? 0,
            payment_method: item.payment_method ?? '-',
            created_at: item.created_at ?? '-',
            created_by: item.created_by ?? '-',
            purchase_order_details: item.purchase_order_details ?? [],
            open: true
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

        // Sesuaikan body payload sesuai API
        const body = {
            person_id: values.person_id ?? 0,          // wajib sesuai API
            status: values.status ?? 'DP',             // default DP jika kosong
            down_payment: values.down_payment ?? 0,    // optional
            total_amount: values.total_amount ?? 0,    // otomatis dihitung
            final_amount: values.final_amount ?? 0,    // otomatis dihitung
            discount_amount: values.discount_amount ?? 0,
            payment_method: values.payment_method ?? 'CASH', // default
            create_by: values.create_by ?? 'system',   // default creator
            keterangan: values.keterangan ?? '',
            details: values.details ?? []              // array { item_id, qty }
        };

        try {
            if ((values as any).id) {
                await purchaseService.update({ id: String((values as any).id), ...body });
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
        handleGetListItemGudang();
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
