import { capitalizeEachWord } from '$lib/helpers/string-helper';
import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { securitySchema } from '../security-otp/schema';
import type { SecurotyOtpType } from './types';
import { profileSchema } from '../my-profile/edit-my-profile/shema';

export function useProfilePage() {
    const formEdit = superForm(defaults(zod(profileSchema)), {
        SPA: true,
        validators: zod(profileSchema),
        dataType: 'json',
        resetForm: false
    });
    const form = superForm(defaults(zod(securitySchema)), {
        SPA: true,
        validators: zod(securitySchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<SecurotyOtpType>({
        currentPassword: '',
        newPassword: '',
        reTypeNewPassword: ''
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/flight/reservation-detail');
        } else {
            toast.error('Please check your input');
        }
    }


    return {
        state,
        form,
        formEdit,
        errors,

    };
}
