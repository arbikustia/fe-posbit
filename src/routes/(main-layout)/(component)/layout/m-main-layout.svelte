<script lang="ts">
	import MLayoutNavBar from './m-layout-navbar.svelte';
	import MLayoutHeader from './m-layout-header.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const excludeShowHeaderAndNavBarRoutes = ['flight', 'hotel', 'train', 'insurance'];

	const basePathName = $derived(page.url.pathname.split('/')[1]);
</script>

<div class="app relative h-lvh" id="main-layout">
	{#if excludeShowHeaderAndNavBarRoutes.includes(basePathName)}
		<div class="mx-auto max-w-lg">
			<main>
				{@render children()}
			</main>
		</div>
	{:else}
		<div class="mx-auto max-w-lg pb-20 pt-12">
			<MLayoutHeader />
			<main>
				{@render children()}
			</main>
			<MLayoutNavBar />
		</div>
	{/if}
</div>
