import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { userSchema } from '../_components/form/schema';

export function useUserPage() {
    const form = superForm(defaults(zod(userSchema)), {
        SPA: true,
        validators: zod(userSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<any>({
        fistName: ''
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/master/user');
        } else {
            toast.error('Please check your input');
        }
    }


    return {
        state,
        form,
        errors,
        handleSubmit
    };
}
