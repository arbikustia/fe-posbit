<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { onMount } from 'svelte';
	import { TransactionPage } from './_components/page';
	import SearchForm from './_components/search-form/search-form.svelte';
	import { cn } from '$lib/utils';
	import { useTransactionForm } from './form.svelte';

	const { state: statePage, handleSearchProduct } = useTransactionForm();

	$effect(() => {
		console.log('🧾 item table page changes:', statePage.itemTable);
	});

	let searchFormDefaultHeight = $state(0);
	let scrollY = $state(0);

	onMount(() => {
		searchFormDefaultHeight = document.getElementById('search-form')?.clientHeight ?? 0;
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
		variant={scrollY > 250 ? 'sticky' : 'default'}
		class="transition-all duration-700 ease-in-out"
	/>
</div>

{#if scrollY > 250}
	<div style="height: {searchFormDefaultHeight}px;"></div>
{/if}
<div class="space-y-5 p-5">
	<TransactionPage state={statePage} />
</div>
<svelte:window bind:scrollY />
