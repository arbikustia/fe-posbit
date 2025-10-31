import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { pointSchema } from '../_components/form/schema';
import { hotelService } from '$lib/services/hotelService';
import { pointService } from '$lib/services/pointService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

export function usePointPage() {
    const form = superForm(defaults(zod(pointSchema)), {
        SPA: true,
        validators: zod(pointSchema),
        dataType: 'json',
        resetForm: false
    });
    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedPoint: null | any;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        isLoading: boolean;
        searchTerm: string;
    };


    const { form: formData, validateForm, errors } = form;


    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedPoint: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0,
        isLoading: false,
        searchTerm: '',
    });

    // 🔹 Transform data dari API ke table
    function transformPointData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            amount_per_point: item.amount_per_point ?? '-',
            point_value: item.point_value ?? '-',
            is_active: item.is_active ?? false,
            updated_at: item.updated_at ?? '-',
            open: true
        }));
    }


    async function handleGetPaged(pageNumber = state.currentPage, searchTerm = state.searchTerm) {
        try {

            state.isLoading = true;

            const res: any = await pointService.getPaged({
                PageNumber: pageNumber,
                PageSize: state.pageSize,
                SearchTerm: searchTerm
            });

            if (res?.data?.data) {
                state.table = transformPointData(res.data.data);
                state.currentPage = res.data.page_number ?? pageNumber;
                state.totalPages = res.data.total_pages ?? 1;
                state.totalCount = res.data.total_count ?? state.table.length;
            } else {
                state.table = [];
            }

        } catch (err) {
            console.error('Pagination fetch failed:', err);
            toast.error('Failed to load point');
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


    async function handleSubmit() {
        var result = await validateForm({ update: true });

        if (!result.valid) {
            toast.error('Please check your input');
            return;
        }
        const values = get(formData);

        const body = {
            amount_per_point: values.amount_per_point,
            point_value: values.point_value,
            is_active: values.is_active,
        };

        try {
            if ((values as any).id) {
                await pointService.update({
                    id: String((values as any).id),
                    amount_per_point: body.amount_per_point,
                    point_value: body.point_value,
                    is_active: body.is_active,
                })
                toast.success('Point updated successfully');
            } else {
                await pointService.create(body)
                toast.success('User created successfully');
            }

            goto('/master/point');
        } catch (err) {
            toast.error('Failed to save point');
        }
    }

    $effect(() => {
        (async () => {
            handleGetPaged(1, state.searchTerm);
        })();
    });


    onMount(() => {
        handleGetPaged();

        const url = get(page).url;
        const qp = url.searchParams;
        const hasAny =
            qp.has('username') || qp.has('email') || qp.has('role') || qp.has('id') || qp.has('password');

        if (hasAny) {
            formData.update((f) => ({
                ...f,
                amount_per_point: qp.get('amount_per_point') ?? (f as any).amount_per_point,
                point_value: qp.get('point_value') ?? (f as any).point_value,
                is_active: qp.get('is_active') ?? (f as any).is_active,
                id: qp.get('id') ?? (f as any).id,
            }));
        }
    });




    return {
        state,
        form,
        errors,
        handleSubmit,
        handleGetPaged,
        handlePageChange
    };
}