<script lang="ts">
	import { userStore } from '$lib/stores/userStore';
	import { onDestroy } from 'svelte';
	import { getDeviceContext } from '$lib/context/device';
	import { Layout, MLayout } from './(component)/layout';

	let { children, data } = $props();

	const { isMobile } = getDeviceContext();

	if (data.currentUser) {
		userStore.set(data.currentUser);
	}

	onDestroy(() => {
		userStore.clear();
	});
</script>

<svelte:head>
	<title>Bantuit</title>
</svelte:head>

{#if isMobile}
	<MLayout>
		{@render children()}
	</MLayout>
{:else}
	<Layout>
		{@render children()}
	</Layout>
{/if}
