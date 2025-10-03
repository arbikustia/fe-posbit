import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { departmentSchema } from '../_components/form/schema';

export function useDepartmentPage() {
    const form = superForm(defaults(zod(departmentSchema)), {
        SPA: true,
        validators: zod(departmentSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<any>({
        departmentName: ''
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/master/department');
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
