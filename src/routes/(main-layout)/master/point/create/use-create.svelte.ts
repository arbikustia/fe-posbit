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
    };


    const { form: formData, validateForm, errors } = form;

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedPoint: null
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            const values = get(formData);
            const body = {
                amount_per_point: values.amount_per_point,
                point_value: values.point_value,
                is_active: values.is_active,
            };

            if ((values as any).id) {
                // update existing point
                pointService.update({
                    id: String((values as any).id),
                    amount_per_point: body.amount_per_point,
                    point_value: body.point_value,
                    is_active: body.is_active,
                })
                    .then(() => {
                        toast.success('Point updated successfully');
                        goto('/master/point');
                    })
                    .catch(() => {
                        toast.error('Failed to update point');
                    });
            } else {
                // create new point
                pointService.create(body)
                    .then(() => {
                        toast.success('Point created successfully');
                        goto('/master/point');
                    })
                    .catch(() => {
                        toast.error('Failed to create point');
                    });
            }

            console.log('form values:', values);
        } else {
            toast.error('Please check your input');
        }
    }

    // Function untuk transform data dari API ke format rows
    function transformPointData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1, // Gunakan ID dari API atau buat sequential
            amount_per_point: item.amount_per_point,
            point_value: item.point_value,
            is_active: item.is_active,
            last_created: item.last_created,
            open: true // Default value untuk properti open
        }));
    }

    async function handleGetPaged() {
        try {
            const res: any = await pointService.getPaged({
                PageNumber: 1,
                PageSize: 10,
                SearchTerm: ''
            });

            // Transform data dari API ke format yang diinginkan
            if (res.data && res.data.data) {
                state.table = transformPointData(res.data.data);
            } else {
                // Fallback ke data dummy jika struktur response berbeda
                state.table = [];
            }

            console.log(res.data.data, 'data');
            console.log(state.table, 'transformed point data');
        } catch (err) {
            console.log(err);
            // Fallback ke data dummy jika error
            state.table = [];
        }
    }

    onMount(() => {
        handleGetPaged();
        // jika ada query params (edit) maka isi default form dengan nilai dari URL
        const url = get(page).url;
        const qp = url.searchParams;
        const hasAny = qp.has('amount_per_point') || qp.has('point_value') || qp.has('is_active') || qp.has('id');
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
        handleGetPaged // Export jika perlu dipanggil ulang
    };
}