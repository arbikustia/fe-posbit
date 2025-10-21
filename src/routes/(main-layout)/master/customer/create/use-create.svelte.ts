import { toast } from 'svelte-sonner';
import { superForm, defaults } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goto } from '$app/navigation';
import { customerSchema } from '../_components/form/schema';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { customerService } from '@/services/customerService';

export function useCustomerPage() {
    const form = superForm(defaults(zod(customerSchema)), {
        SPA: true,
        validators: zod(customerSchema),
        dataType: 'json',
        resetForm: false
    });

    type stateProps = {
        table: any[];
        showSearch: boolean;
        searchEl: HTMLInputElement | null;
        showDeleteModal: boolean;
        selectedCustomer: null | any;
    };

    const { form: formData, validateForm, errors } = form;

    const state = $state<stateProps>({
        table: [],
        showSearch: false,
        searchEl: null,
        showDeleteModal: false,
        selectedCustomer: null
    });

    async function handleSubmit() {
        const result = await validateForm({ update: true });
        if (result.valid) {
            const values = get(formData);
            const body = {
                customer_name: values.customer_name,
                phone: values.phone,
                is_member: values.is_member,
                member_since: values.member_since,
                // ensure empty string when not provided
                member_code: values.member_code ?? '',
                point: Number(values.point)
            };

            if ((values as any).id) {
                // update existing customer
                customerService.update({
                    id: String((values as any).id),
                    customer_name: body.customer_name,
                    phone: body.phone,
                    is_member: body.is_member,
                    member_since: body.member_since,
                    member_code: body.member_code,
                    point: body.point
                })
                    .then(() => {
                        toast.success('Customer updated successfully');
                        goto('/master/customer');
                    })
                    .catch(() => {
                        toast.error('Failed to update customer');
                    });
            } else {
                // create new customer
                customerService.create(body)
                    .then(() => {
                        toast.success('Customer created successfully');
                        goto('/master/customer');
                    })
                    .catch(() => {
                        toast.error('Failed to create customer');
                    });
            }

            console.log('form values:', values);
        } else {
            toast.error('Please check your input');
        }
    }

    function transformCustomerData(apiData: any[]) {
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            customer_name: item.customer_name,
            phone: item.phone,
            is_member: item.is_member,
            member_since: item.member_since,
            // default to empty string if missing
            member_code: item.member_code ?? '',
            point: item.point,
            last_created: item.last_created,
            open: true
        }));
    }

    async function handleGetPaged() {
        try {
            const res: any = await customerService.getPaged({
                PageNumber: 1,
                PageSize: 10,
                SearchTerm: ''
            });

            if (res.data && res.data.data) {
                state.table = transformCustomerData(res.data.data);
            } else {
                state.table = [];
            }

            console.log(res.data?.data, 'customer data');
            console.log(state.table, 'transformed customer data');
        } catch (err) {
            console.log(err);
            state.table = [];
        }
    }

    onMount(() => {
        handleGetPaged();

        const url = get(page).url;
        const qp = url.searchParams;
        const hasAny =
            qp.has('customer_name') ||
            qp.has('phone') ||
            qp.has('is_member') ||
            qp.has('member_since') ||
            qp.has('member_code') ||
            qp.has('point') ||
            qp.has('id');

        if (hasAny) {
            formData.update((f) => ({
                ...f,
                customer_name: qp.get('customer_name') ?? f.customer_name,
                phone: qp.get('phone') ?? f.phone,
                is_member:
                    qp.has('is_member') ? (qp.get('is_member') === 'true' || qp.get('is_member') === '1') : f.is_member,
                member_since: qp.get('member_since') ?? f.member_since,
                // ensure member_code becomes empty string if not present
                member_code: qp.get('member_code') ?? f.member_code ?? '',
                point: qp.has('point') ? Number(qp.get('point')) : f.point,
                id: qp.get('id') ?? (f as any).id
            }));
        }
    });

    return {
        state,
        form,
        errors,
        handleSubmit,
        handleGetPaged
    };
}