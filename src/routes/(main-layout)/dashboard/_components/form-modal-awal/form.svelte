<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { useCashierModalPage } from './use-form.svelte';
	import { userService } from '@/services/userService';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { customerService } from '@/services/customerService';

	type ModalFormProps = {
		showModalAwal: boolean;
		type: string;
		closeModalPage?: () => void;
	};

	let username: string = $state('');
	let modalState = $state({ is_open: false });
	let { showModalAwal, type, closeModalPage }: ModalFormProps = $props();

	const { form, handleSubmit, errors, enhance, closeModal } = useCashierModalPage(
		type as 'create' | 'update',
		modalState
	);
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
		const res:any = await userService.getPaged({
			PageNumber: 1,
			PageSize: 1000000,
			SearchTerm: ''
		});
		dataCashier = res.data.data.find((u: any) => u.username === username);

		const cashier = dataCashier?.id;
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

	$effect(() => {
		(async () => {
			if(modalState.is_open == false){
				closeModalPage?.();
			}
		})();
	});

	function handleClose() {
		closeModal();
	}

	// ================================
	// 💰 Format Rupiah Handler
	// ================================
	function formatIDR(value: number | string) {
		if (!value) return '';
		const num = Number(String(value).replace(/[^\d]/g, ''));
		return num.toLocaleString('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		});
	}

	// 🔹 Handle input modal_awal
	function handleModalAwalInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.modal_awal = Number(raw || 0);
		target.value = formatIDR(raw);
	}

	// 🔹 Handle input actual_earning
	function handleActualEarningInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$formData.actual_earning = Number(raw || 0);
		target.value = formatIDR(raw);
	}
</script>

<Dialog.Root
	bind:open={modalState.is_open}
	onOpenChange={() => (modalState.is_open == true ? (modalState.is_open = false) : null)}
>
	<Dialog.Content
		class="rounded-2xl sm:max-w-[500px]"
		escapeKeydownBehavior="ignore"
		interactOutsideBehavior="ignore"
		showCloseButton={type !== 'create' ? true : false}
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
						<Input
							type="text"
							inputmode="numeric"
							placeholder="Enter Modal Awal"
							value={formatIDR($formData.modal_awal)}
							oninput={handleModalAwalInput}
							class="text-left"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{:else}
				<Form.Field {form} name="actual_earning" class="mt-4">
					<Form.Control>
						<Form.Label>Actual Earning</Form.Label>
						<Input
							type="text"
							inputmode="numeric"
							placeholder="Enter Actual Earning"
							value={formatIDR($formData.actual_earning)}
							oninput={handleActualEarningInput}
							class="text-left"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<div class="mt-6 flex justify-end gap-3">
				<Button type="submit" class="bg-primary text-white">Save</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
