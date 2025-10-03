import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { auditScheduleSchema } from '../_components/form/schema';
import dayjs from 'dayjs';

export function useAuditSchedulePage() {
    const form = superForm(defaults(zod(auditScheduleSchema)), {
        SPA: true,
        validators: zod(auditScheduleSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, validateForm, errors } = form;

    const state = $state<any>({
        dataForm: {
            name: '',
            audit_plan_id: '',
            id_location_audit: '',
            id_department_audit: '',
            id_auditor: '',
            id_auditee: '',
            id_template: '',
            date: {
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(0, 'day').format('YYYY-MM-DD')
            },
            description: '',
        }
    });

    async function handleSubmit() {
        var result = await validateForm({ update: true });
        if (result.valid) {
            // toast.success('Book Now');
            goto('/planning/audit-schedule');
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
