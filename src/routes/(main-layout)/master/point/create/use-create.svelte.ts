import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { pointSchema } from '../_components/form/schema';

export function usePointPage() {
    const form = superForm(defaults(zod(pointSchema)), {
        SPA: true,
        validators: zod(pointSchema),
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
            goto('/master/point');
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
