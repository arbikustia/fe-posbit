<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { BITCard } from '@/components/opsigo-ui/card';
	import type { SuperForm } from 'sveltekit-superforms';
	import type z from 'zod';
	import type { modalSchema } from './schema';
	import { goto } from '$app/navigation';
	import { useCashierModalPage } from './use-form.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import { userService } from '@/services/userService';
	import { itemService } from '@/services/itemService';

	type ModalFormProps = {
		showModalAwal: boolean;
		type: string;
	};

	let { showModalAwal, type }: ModalFormProps = $props();
	const { form, handleSubmit, state:modalState } = useCashierModalPage();
	const { form: formData, enhance, errors } = form;
	let dataCashier: { username: string; id: string }[] = $state([]);

	onMount(async () => {
		console.log('showModalAwal:', showModalAwal);
		const user = await userService
			.getPaged({ PageNumber: 1, PageSize: 1000000, SearchTerm: '' })
			.then((res: any) => {
				console.log('User data:', res.data.data);
				dataCashier = res.data.data.filter((item: { role: string }) => item.role == 'Cashier');
			});
	});

	$effect(() => {
		(async () => {
            modalState.is_open = showModalAwal;
			console.log(dataCashier, 'dataCashier');
		})();
	});
</script>

<Dialog.Root bind:open={modalState.is_open}>
	<Dialog.Content class="rounded-2xl sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-semibold">Tambah Modal Awal</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Isi data berikut untuk menyimpan informasi modal awal kasir.
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			use:enhance
			onsubmit={handleSubmit}
			class="container mx-auto w-full px-4 py-4"
		>
			<BITCard title="Modal Awal">
				<!-- CASHIER ID -->
				<Form.Field {form} name="cashier_id">
					<Form.Control>
						<Form.Label class="text-sm font-medium text-gray-700">Cashier Name</Form.Label>
						<!-- <Input
							placeholder="Enter cashier ID"
							bind:value={$formData.cashier_id}
							class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.cashier_id
								? 'border-red-500 focus:border-red-500'
								: ''}"
						/> -->
						<Select.Root type="single" bind:value={$formData.cashier_id}>
							<Select.Trigger class="w-full">{$formData.cashier_id !== '' ? dataCashier.find((item) => item.id == $formData.cashier_id )?.username : "select cashier name"}</Select.Trigger>
							<Select.Content>
								{#each dataCashier as item}
									<Select.Item value={item.id}>{item.username}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-600" />
				</Form.Field>

				{#if type == 'create'}
					<Form.Field {form} name="modal_awal" class="mt-4">
						<Form.Control>
							<Form.Label class="text-sm font-medium text-gray-700">Modal Awal</Form.Label>
							<Input
								type="number"
								placeholder="Enter Modal Awal amount"
								bind:value={$formData.modal_awal}
								class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.modal_awal
									? 'border-red-500 focus:border-red-500'
									: ''}"
							/>
						</Form.Control>
						<Form.FieldErrors class="mt-1 text-sm text-red-600" />
					</Form.Field>
				{:else}
					<Form.Field {form} name="actual_earning" class="mt-4">
						<Form.Control>
							<Form.Label class="text-sm font-medium text-gray-700">Actual Earning</Form.Label>
							<Input
								type="number"
								placeholder="Enter earning amount"
								bind:value={$formData.actual_earning}
								class="mt-1 w-full rounded-md border px-3 py-2 text-sm sm:text-base {$errors.actual_earning
									? 'border-red-500 focus:border-red-500'
									: ''}"
							/>
						</Form.Control>
						<Form.FieldErrors class="mt-1 text-sm text-red-600" />
					</Form.Field>
				{/if}

				<!-- BUTTONS -->
				<div
					class="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end"
				>
					<Button
						type="button"
						variant="outline"
						class="w-full rounded-full px-4 py-2 text-sm text-gray-500 hover:underline sm:w-auto"
						onclick={() => goto('/dashboard')}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						class="bg-primary hover:bg-primary-dark w-full rounded-full px-4 py-2 text-sm text-white transition sm:w-auto"
					>
						Save
					</Button>
				</div>
			</BITCard>
		</form>
	</Dialog.Content>
</Dialog.Root>
