import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { roleSchema } from '../_components/form/schema';
import { hotelService } from '$lib/services/hotelService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { roleService } from '@/services/roleService';

export function useRolePage() {
    const form = superForm(defaults(zod(roleSchema)), {
        SPA: true,
        validators: zod(roleSchema),
        dataType: 'json',
        resetForm: false
    });
    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedRole: null | any;
    };


    const { form: formData, validateForm, errors } = form;

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedRole: null
    });

     async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            const values = get(formData);
            const body = {
                role: values.role,
            };

            if ((values as any).id) {
                // update existing role
                roleService.update({
                    id: String((values as any).id),
                    role: body.role,
                })
                    .then(() => {
                        toast.success('Role updated successfully');
                        goto('/master/role');
                    })
                    .catch(() => {
                        toast.error('Failed to update role');
                    });
            } else {
                // create new role
                roleService.create(body)
                    .then(() => {
                        toast.success('Role created successfully');
                        goto('/master/role');
                    })
                    .catch(() => {
                        toast.error('Failed to create role');
                    });
            }

            console.log('form values:', values);
        } else {
            toast.error('Please check your input');
        }
    }

    // Function untuk transform data dari API ke format rows
    function transformRoleData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1, // Gunakan ID dari API atau buat sequential
            role: item.role,
            last_created: item.last_created,
            open: true // Default value untuk properti open
        }));
    }

    async function handleGetPaged() {
        try {
            const res: any = await roleService.getPaged({
                PageNumber: 1,
                PageSize: 10,
                SearchTerm: ''
            });

            // Transform data dari API ke format yang diinginkan
            if (res.data && res.data.data) {
                state.table = transformRoleData(res.data.data);
            } else {
                // Fallback ke data dummy jika struktur response berbeda
                state.table = [];
            }

            console.log(res.data.data, 'data');
            console.log(state.table, 'transformed role data');
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
        const hasAny = qp.has('rolename') || qp.has('email') || qp.has('role') || qp.has('id') || qp.has('password');
        if (hasAny) {
            formData.update((f) => ({
                ...f,
                role: qp.get('role') ?? f.role,
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