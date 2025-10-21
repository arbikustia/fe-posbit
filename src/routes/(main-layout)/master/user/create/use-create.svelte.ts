import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '../_components/form/schema';
import { hotelService } from '$lib/services/hotelService';
import { userService } from '$lib/services/userService';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

export function useUserPage() {
    const form = superForm(defaults(zod(userSchema)), {
        SPA: true,
        validators: zod(userSchema),
        dataType: 'json',
        resetForm: false
    });
    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedUser: null | any;
    };


    const { form: formData, validateForm, errors } = form;

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedUser: null
    });

     async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            const values = get(formData);
            const body = {
                username: values.userName,
                email: values.email,
                password: values.password,
                role: [values.role]
            };

            if ((values as any).id) {
                // update existing user
                userService.update({
                    id: String((values as any).id),
                    username: body.username,
                    email: body.email,
                    password: body.password,
                    role: body.role
                })
                    .then(() => {
                        toast.success('User updated successfully');
                        goto('/master/user');
                    })
                    .catch(() => {
                        toast.error('Failed to update user');
                    });
            } else {
                // create new user
                userService.create(body)
                    .then(() => {
                        toast.success('User created successfully');
                        goto('/master/user');
                    })
                    .catch(() => {
                        toast.error('Failed to create user');
                    });
            }

            console.log('form values:', values);
        } else {
            toast.error('Please check your input');
        }
    }

    // Function untuk transform data dari API ke format rows
    function transformUserData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1, // Gunakan ID dari API atau buat sequential
            username: item.username,
            password: item.password,
            role: item.role,
            email: item.email,
            last_created: item.last_created,
            open: true // Default value untuk properti open
        }));
    }

    async function handleGetPaged() {
        try {
            const res: any = await userService.getPaged({
                PageNumber: 1,
                PageSize: 10,
                SearchTerm: ''
            });

            // Transform data dari API ke format yang diinginkan
            if (res.data && res.data.data) {
                state.table = transformUserData(res.data.data);
            } else {
                // Fallback ke data dummy jika struktur response berbeda
                state.table = [];
            }

            console.log(res.data.data, 'data');
            console.log(state.table, 'transformed user data');
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
        const hasAny = qp.has('username') || qp.has('email') || qp.has('role') || qp.has('id') || qp.has('password');
        if (hasAny) {
            formData.update((f) => ({
                ...f,
                userName: qp.get('username') ?? f.userName,
                email: qp.get('email') ?? f.email,
                role: qp.get('role') ?? f.role,
                id: qp.get('id') ?? (f as any).id,
                // ambil password langsung dari query param jika ada
                password: qp.get('password') ?? f.password
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