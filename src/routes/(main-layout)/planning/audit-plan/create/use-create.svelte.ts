import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { auditPlanSchema } from '../_components/form/schema';
import dayjs from 'dayjs';

export function useAuditPlanPage() {
    const form = superForm(defaults(zod(auditPlanSchema)), {
        SPA: true,
        validators: zod(auditPlanSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<any>({
        dataForm: {
            name: '',
            id_category: '',
            audit_purpose: '',
            date: {
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(0, 'day').format('YYYY-MM-DD')
            }
        }
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/planning/audit-plan');
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
