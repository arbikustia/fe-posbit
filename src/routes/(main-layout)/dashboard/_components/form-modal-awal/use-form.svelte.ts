// use-form.svelte
import { toast } from 'svelte-sonner';
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { modalService } from '@/services/modalService';
import { modalCreateSchema, modalUpdateSchema } from './schema';

// import schemas baru


export function useCashierModalPage(type: 'create' | 'update', modalState: { is_open: boolean }) {
  // debug indicator
  const debug = true;

  let idSale = $state('');

  const state = $state<any>({
    dataModal: null
  });

  // initial values are generic; specific validations come from selected schema
  const initialValues = {
    id: '',
    cashier_id: '',
    modal_awal: 0,
    actual_earning: 0,
    is_modal_awal: type === 'create'
  };

  // pick schema based on type
  const chosenSchema = type === 'create' ? modalCreateSchema : modalUpdateSchema;

  const form = superForm(initialValues, {
    SPA: true,
    validators: zod(chosenSchema),
    dataType: 'json',
    resetForm: false
  });

  const { form: formData, validateForm, errors, enhance } = form;

  // fetch idSale and set to form when available
  onMount(async () => {
    try {
      const res = await modalService.getModalAwal();
      idSale = res.data?.data?.id || '';
      console.log(res.data.data, 'ttt')
      state.dataModal = res?.data?.data
      if (idSale) {
        formData.update((f) => ({ ...f, id: idSale }));
      }
    } catch (err) {
      console.error('[useCashierModalPage] Failed to get modal status:', err);
      toast.error('Failed to fetch modal status');
    }
  });

  // main submit with extra debug
  async function handleSubmit(event?: Event) {
    // prevent default if called via <form on:submit>
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    // debug log before validate
    if (debug) {
      console.log('[handleSubmit] validateForm about to run. type=', type);
      console.log('[handleSubmit] current formData (before validate):', get(formData));
    }

    const result = await validateForm();

    // debug validate result
    if (debug) {
      console.log('[handleSubmit] validateForm result:', result);
      console.log('[handleSubmit] errors store:', get(errors));
    }

    if (!result.valid) {
      console.log('[handleSubmit] Validation failed:', result.errors);
      toast.error('Please check your input');
      return;
    }

    const values = get(formData);
    if (debug) console.log('[handleSubmit] values after validation:', values);

    try {
      if (type === 'create') {
        // ensure cashier_id & modal_awal exist (redundant with schema but safe)
        if (!values.cashier_id || values.modal_awal <= 0) {
          toast.error('Cashier ID and Modal Awal are required');
          return;
        }
        const body = {
          cashier_id: values.cashier_id,
          modal_awal: Number(values.modal_awal),
          is_modal_awal: true
        };
        if (debug) console.log('[handleSubmit] create body:', body);
        await modalService.create(body);
        toast.success('Cashier modal created successfully');
      } else {
        if (!values.id || values.actual_earning <= 0) {
          toast.error('ID and Actual Earning are required');
          return;
        }
        const body = {
          id: values.id,
          cashier_id: values.cashier_id,
          actual_earning: Number(values.actual_earning)
        };
        if (debug) console.log('[handleSubmit] update body:', body);
        await modalService.update(body);
        toast.success('Cashier modal updated successfully');
      }

      // close modal via parent state (single source of truth)
      modalState.is_open = false;
      // reset form after closing
      form.reset();

      if (debug) console.log('[handleSubmit] modalState.is_open set to false, form.reset called.');
    } catch (err: any) {
      console.error('[handleSubmit] Error saving cashier modal:', err);
      toast.error(err.message || 'Failed to save cashier modal');
    }
  }

  function closeModal() {
    modalState.is_open = false;
    if (debug) console.log('[closeModal] modalState.is_open = false');
  }

  // optional: prefill from URL params
  onMount(() => {
    const url = get(page).url;
    const qp = url.searchParams;
    if (qp.size > 0) {
      formData.update((f) => ({
        ...f,
        id: qp.get('id') || f.id,
        cashier_id: qp.get('cashier_id') || f.cashier_id,
        modal_awal: qp.has('modal_awal') ? Number(qp.get('modal_awal')) : f.modal_awal,
        actual_earning: qp.has('actual_earning') ? Number(qp.get('actual_earning')) : f.actual_earning,
        is_modal_awal: type === 'create'
      }));
      if (debug) console.log('[useCashierModalPage] prefilled from qp ->', get(formData));
    }
  });

  return {
    state,
    form,
    errors,
    handleSubmit,
    enhance,
    closeModal
  };
}
