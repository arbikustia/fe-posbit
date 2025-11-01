<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Form from '$lib/components/ui/form';
  import Input from '$lib/components/ui/input/input.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { useCashierModalPage } from './use-form.svelte';
  import { userService } from '@/services/userService';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  type ModalFormProps = {
    showModalAwal: boolean;
    type: string;
  };

  let username: string = $state('');
  let modalState = $state({ is_open: false });
  let { showModalAwal, type }: ModalFormProps = $props();

  const { form, handleSubmit, errors, enhance, closeModal } = useCashierModalPage(type as 'create' | 'update', modalState);
  const { form: formData } = form;
  let dataCashier: { username: string; id: string }[] = $state([]);

  function getCookie(name: string) {
    if (!browser) return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  onMount(async () => {
    username = getCookie('username') || 'superadmin';
    const res = await userService.getPaged({
      PageNumber: 1,
      PageSize: 1000000,
      SearchTerm: ''
    });
    dataCashier = res.data.data.filter((u: any) => u.role === 'Cashier');

    const cashier = dataCashier.find((u) => u.username === username);
    if (cashier) {
      $formData.cashier_id = cashier.id;
      console.log('[ModalForm] auto-set cashier_id ->', cashier.id);
    }

    $formData.is_modal_awal = type === 'create';
  });

  // Modal only follows initial prop
  onMount(() => {
    if (showModalAwal) {
      modalState.is_open = true;
    }
  });

  function handleClose() {
    closeModal();
  }
</script>

<Dialog.Root bind:open={modalState.is_open}>
  <Dialog.Content
    class="rounded-2xl sm:max-w-[500px]"
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
    showCloseButton={false}
  >
    <Dialog.Header>
      <Dialog.Title class="text-lg font-semibold">
        {type === 'create' ? 'Tambah Modal Awal' : 'Update Actual Earning'}
      </Dialog.Title>
      <Dialog.Description class="text-sm text-gray-500">
        {type === 'create'
          ? 'Isi data berikut untuk menyimpan informasi modal awal kasir.'
          : 'Isi data berikut untuk menyimpan informasi actual earning kasir.'}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance on:submit|preventDefault={handleSubmit} class="w-full py-4">
      <input type="hidden" bind:value={$formData.id} />
      <input type="hidden" bind:value={$formData.cashier_id} />
      <input type="hidden" bind:value={$formData.is_modal_awal} />

      <Form.Field {form} name="cashier_id">
        <Form.Control>
          <Form.Label>Cashier Name</Form.Label>
          <Input disabled value={username} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      {#if type === 'create'}
        <Form.Field {form} name="modal_awal" class="mt-4">
          <Form.Control>
            <Form.Label>Modal Awal</Form.Label>
            <Input type="number" bind:value={$formData.modal_awal} placeholder="Enter Modal Awal" />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {:else}
        <Form.Field {form} name="actual_earning" class="mt-4">
          <Form.Control>
            <Form.Label>Actual Earning</Form.Label>
            <Input type="number" bind:value={$formData.actual_earning} placeholder="Enter Actual Earning" />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/if}

      <div class="mt-6 flex justify-end gap-3">
        <Button type="submit" class="bg-primary text-white">
          Save
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
