import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { modalService } from '@/services/modalService';
import { modalSchema } from './schema';

export function useCashierModalPage() {
    const form = superForm(defaults(zod(modalSchema)), {
        SPA: true,
        validators: zod(modalSchema),
        dataType: 'json',
        resetForm: false
    });

    type stateProps = {
        table: any[];
        isLoading: boolean;
        is_open: boolean;
    };

    const { form: formData, validateForm, errors } = form;

    const state = $state<stateProps>({
        table: [],
        isLoading: false,
        is_open: false
    });

    // 🔹 Create / Update logic
    async function handleSubmit() {
        const result = await validateForm({ update: true });
        if (!result.valid) {
            toast.error('Please check your input');
            return;
        }

        const values = get(formData);

        try {
            if ((values as any).id) {
                // UPDATE MODE
                const body = {
                    id: String(values.id),
                    cashier_id: values.cashier_id,
                    actual_earning: Number(values.actual_earning) || 0
                };

                await modalService.update(body);
                toast.success('Cashier modal updated successfully');
            } else {
                // CREATE MODE
                const body = {
                    cashier_id: values.cashier_id,
                    modal_awal: Number(values.modal_awal) || 0,
                    is_modal_awal: true
                };

                await modalService.create(body);
                toast.success('Cashier modal created successfully');
            }
            state.is_open = false;
        } catch (err) {
            console.error(err);
            toast.error('Failed to save cashier modal');
        }
    }

    onMount(() => {
        const url = get(page).url;
        const qp = url.searchParams;
        const hasAny =
            qp.has('cashier_id') || qp.has('modal_awal') || qp.has('actual_earning') || qp.has('id');

        if (hasAny) {
            formData.update((f) => ({
                ...f,
                id: qp.get('id') ?? (f as any).id,
                cashier_id: qp.get('cashier_id') ?? f.cashier_id,
                modal_awal: qp.has('modal_awal') ? Number(qp.get('modal_awal')) : f.modal_awal,
                actual_earning: qp.has('actual_earning')
                    ? Number(qp.get('actual_earning'))
                    : f.actual_earning
            }));
        }
    });

    return {
        state,
        form,
        errors,
        handleSubmit
    };
}
