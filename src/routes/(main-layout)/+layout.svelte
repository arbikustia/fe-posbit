<script lang="ts">
	import { userStore } from '$lib/stores/userStore';
	import { onDestroy, onMount } from 'svelte';
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

	onMount(() => {
		try {
			const el = document.documentElement;

			// 🔹 Fullscreen untuk semua browser
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if ((el as any).webkitRequestFullscreen) {
				// Safari / iPadOS / older WebKit
				(el as any).webkitRequestFullscreen();
			} else if ((el as any).msRequestFullscreen) {
				// Old Microsoft Edge / IE
				(el as any).msRequestFullscreen();
			}
		} catch (e) {
			console.warn('Gagal masuk fullscreen:', e);
		}
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
