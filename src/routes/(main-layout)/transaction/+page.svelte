<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { onMount } from 'svelte';
	import { TransactionPage } from './_components/page';
	import SearchForm from './_components/search-form/search-form.svelte';
	import { cn } from '$lib/utils';
	import { useTransactionForm } from './form.svelte';
	import { getUserRole } from '@/rbacUtils';
	import { modalService } from '@/services/modalService';
	import { FormModalAwal } from '../dashboard/_components/form-modal-awal';

	const { state: statePage, handleSearchProduct, handleGetListItemGudang } = useTransactionForm();

	$effect(() => {
		console.log('🧾 item table page changes:', statePage.itemTable);
	});

	let searchFormDefaultHeight = $state(0);
	let scrollY = $state(0);

	onMount(() => {
		searchFormDefaultHeight = document.getElementById('search-form')?.clientHeight ?? 0;
	});

	let showModalAwal = $state(false);

	onMount(async () => {
		const role = getUserRole();
		if (role == 'Cashier') {
			console.warn(role, 'role');
			try {
				const res = await modalService.getStatusModalAwal();
				console.log('Response modal awal:', res);

				// Perbaiki logika kondisi
				if (res?.data?.data == null) {
					// Jika data null, tampilkan modal
					showModalAwal = false;
				} else if (res.data?.data?.shift1 === '0' || res.data?.data?.shift2 === '0') {
					// Jika shift1 atau shift2 adalah '0', tampilkan modal
					showModalAwal = true;
				} else {
					showModalAwal = false;
				}

				console.log('showModalAwal set to:', showModalAwal);
			} catch (error) {
				console.error('Error fetching modal status:', error);
				showModalAwal = false;
			}
		}
	});
</script>

<div
	id="search-form"
	class={cn({
		'p-5 pb-0': scrollY <= 250,
		'sticky top-0 z-50': scrollY > 250
	})}
>
	<SearchForm
		{handleSearchProduct}
		state={statePage}
		{handleGetListItemGudang}
		variant={scrollY > 250 ? 'sticky' : 'default'}
		class="transition-all duration-700 ease-in-out"
	/>
</div>

{#if scrollY > 250}
	<div style="height: {searchFormDefaultHeight}px;"></div>
{/if}
<div class="space-y-5 p-5">
	<TransactionPage state={statePage} />
	{#if showModalAwal}
		<FormModalAwal type="create" {showModalAwal} />
	{/if}
</div>
<svelte:window bind:scrollY />
