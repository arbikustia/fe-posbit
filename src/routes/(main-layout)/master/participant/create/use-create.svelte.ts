import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { participantSchema } from '../_components/form/schema';

export function useParticipantPage() {
    const form = superForm(defaults(zod(participantSchema)), {
        SPA: true,
        validators: zod(participantSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<any>({
        dataForm: {
            id_user: '',
            role: []
        }
    });

    $effect(() => {
        console.log('State updated:', formData);
        console.log('State.role:', state.dataForm.role);
    });


    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/master/participant');
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
