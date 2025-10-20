import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '../_components/form/schema';
import { hotelService } from '$lib/services/hotelService';
import { userService } from '$lib/services/userService';
import { onMount } from 'svelte';

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
            const res = await hotelService.getAll()
            console.log(res, 'res')
            // toast.success('Book Now');
            // goto('/master/user');
        } else {
            toast.error('Please check your input');
        }
    }

    // Function untuk transform data dari API ke format rows
    function transformUserData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1, // Gunakan ID dari API atau buat sequential
            username: item.username,
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
    });

    return {
        state,
        form,
        errors,
        handleSubmit,
        handleGetPaged // Export jika perlu dipanggil ulang
    };
}