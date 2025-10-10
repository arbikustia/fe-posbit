<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { onMount } from 'svelte';
	import { TransactionPage, MTransactionPage } from './_components/page';
	import SearchForm from './_components/search-form/search-form.svelte';
	import { cn } from '$lib/utils';

	const { isMobile } = getDeviceContext();
	let searchFormDefaultHeight = $state(0);
	let scrollY = $state(0);

	onMount(() => {
		searchFormDefaultHeight = document.getElementById('search-form')?.clientHeight ?? 0;
	});
</script>

{#if isMobile}
	<div class="p-5">
		<MTransactionPage />
	</div>
{:else}
	<div
		id="search-form"
		class={cn({
			'p-5 pb-0': scrollY <= 250,
			'sticky top-0 z-50': scrollY > 250
		})}
	>
		<SearchForm
			variant={scrollY > 250 ? 'sticky' : 'default'}
			class="transition-all duration-700 ease-in-out"
		/>
	</div>

	{#if scrollY > 250}
		<div style="height: {searchFormDefaultHeight}px;"></div>
	{/if}
	<div class="space-y-5 p-5">
		<TransactionPage />
	</div>
{/if}
<svelte:window bind:scrollY />
